import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCampaign, updateCampaign, sendCampaign, scheduleCampaign, getCampaignById } from '../../../services/campaignService';
import { getTemplates } from '../../../services/templateService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Mail, MessageSquare, Send, CalendarClock } from 'lucide-react';
import { SectionLoader } from '../../../components/shared/Loader';

const inputClass =
  'w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none shadow-sm transition-all focus:border-red-500';
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
const sectionTitleClass = 'text-xl font-bold text-gray-900 mb-4';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [type, setType] = useState('email'); // 'email' or 'sms'
  const [subject, setSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [emailTemplateId, setEmailTemplateId] = useState('');

  // Filters state
  const [roleFilter, setRoleFilter] = useState('user');
  const [isActiveFilter, setIsActiveFilter] = useState('true');

  const [templates, setTemplates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  // Send timing: 'now' or 'schedule'
  const [sendTiming, setSendTiming] = useState('now');
  const [scheduledAt, setScheduledAt] = useState('');

  useEffect(() => {
    if (type === 'email') {
      fetchTemplates();
    }
  }, [type]);

  useEffect(() => {
    if (isEditMode) {
      fetchCampaign();
    }
  }, [id]);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load templates');
    }
  };

  const fetchCampaign = async () => {
    try {
      const campaign = await getCampaignById(id);
      setName(campaign.name || '');
      setType(campaign.type || 'email');
      setSubject(campaign.subject || '');
      setMessageContent(campaign.messageContent || '');
      setEmailTemplateId(campaign.emailTemplateId?._id || campaign.emailTemplateId || '');
      setRoleFilter(campaign.filters?.role || 'user');
      setIsActiveFilter(
        campaign.filters?.isActive === undefined ? 'all' : campaign.filters.isActive ? 'true' : 'false'
      );
    } catch (error) {
      toast.error('Failed to load campaign');
      navigate('/admin/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const buildPayload = () => {
    const payload = {
      name,
      type,
      filters: {
        role: roleFilter,
        isActive: isActiveFilter === 'true' ? true : isActiveFilter === 'false' ? false : undefined,
      },
    };

    if (type === 'email') {
      payload.subject = subject;
      payload.emailTemplateId = emailTemplateId;
    } else {
      payload.messageContent = messageContent;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && sendTiming === 'schedule' && !scheduledAt) {
      toast.error('Please pick a schedule date/time');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateCampaign(id, buildPayload());
        toast.success('Campaign updated');
        navigate('/admin/campaigns');
      } else {
        const newCampaign = await createCampaign(buildPayload());

        if (sendTiming === 'schedule') {
          await scheduleCampaign(newCampaign._id, new Date(scheduledAt).toISOString());
          toast.success('Campaign scheduled');
        } else {
          const sendResult = await sendCampaign(newCampaign._id);
          toast.success(`Campaign started! Targeting ${sendResult.targetCount} users.`);
        }
        navigate('/admin/campaigns');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-8">
        <SectionLoader text="Loading campaign..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6">
      <div className="w-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditMode ? 'Update this campaign before it goes out.' : 'Set up an email or SMS campaign for your audience.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/campaigns')}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
            Back to Campaigns
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className={sectionTitleClass}>Campaign Details</h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Campaign Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Winter Promo 2026"
                />
              </div>

              <div>
                <label className={labelClass}>Campaign Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('email')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      type === 'email'
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Mail size={16} /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('sms')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      type === 'sms'
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <MessageSquare size={16} /> SMS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className={sectionTitleClass}>Target Audience (Filters)</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>User Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={inputClass}
                >
                  <option value="user">Customers</option>
                  <option value="vendor">Vendors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Account Status</label>
                <select
                  value={isActiveFilter}
                  onChange={(e) => setIsActiveFilter(e.target.value)}
                  className={inputClass}
                >
                  <option value="all">All</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className={sectionTitleClass}>Content</h2>

            {type === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Email Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Template</label>
                  <select
                    required
                    value={emailTemplateId}
                    onChange={(e) => setEmailTemplateId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="" disabled>Select a Template...</option>
                    {templates.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                  {templates.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">
                      No templates found.{' '}
                      <span onClick={() => navigate('/admin/campaigns/templates')} className="underline cursor-pointer font-semibold">
                        Create one first.
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className={labelClass}>SMS Message</label>
                <textarea
                  required
                  rows="4"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className={inputClass}
                  placeholder="Type your SMS message here..."
                ></textarea>
                <p className="text-xs text-gray-400 mt-2">Note: SMS usually charges per 160 characters.</p>
              </div>
            )}
          </div>

          {/* Timing Section */}
          {!isEditMode && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className={sectionTitleClass}>When to Send</h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setSendTiming('now')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    sendTiming === 'now'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Send size={16} /> Send Now
                </button>
                <button
                  type="button"
                  onClick={() => setSendTiming('schedule')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    sendTiming === 'schedule'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <CalendarClock size={16} /> Schedule for Later
                </button>
              </div>

              {sendTiming === 'schedule' && (
                <div>
                  <label className={labelClass}>Schedule Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/campaigns')}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (type === 'email' && !emailTemplateId)}
              className="rounded-xl bg-[#e61e2d] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                ? 'Save Changes'
                : sendTiming === 'schedule'
                ? 'Schedule Campaign'
                : 'Send Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
