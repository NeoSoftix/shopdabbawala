import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCampaign, updateCampaign, sendCampaign, scheduleCampaign, getCampaignById } from '../../../services/campaignService';
import { getTemplates } from '../../../services/templateService';
import { toast } from 'react-hot-toast';

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

  if (loading) return <div className="p-6">Loading campaign...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Campaign' : 'Create New Campaign'}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6 space-y-6">
        {/* Campaign Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Campaign Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Campaign Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Winter Promo 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Campaign Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="email">Email</option>
              <option value="sms">SMS Text Message</option>
            </select>
          </div>
        </div>

        {/* Target Audience Filters */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-lg font-semibold border-b pb-2">Target Audience (Filters)</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="user">Customers</option>
                <option value="vendor">Vendors</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Account Status</label>
              <select
                value={isActiveFilter}
                onChange={(e) => setIsActiveFilter(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-lg font-semibold border-b pb-2">Content</h2>

          {type === 'email' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Email Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Template</label>
                <select
                  required
                  value={emailTemplateId}
                  onChange={(e) => setEmailTemplateId(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="" disabled>Select a Template...</option>
                  {templates.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
                {templates.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    No templates found. <span onClick={() => navigate('/admin/campaigns/templates')} className="underline cursor-pointer">Create one first.</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">SMS Message</label>
              <textarea
                required
                rows="4"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type your SMS message here..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Note: SMS usually charges per 160 characters.</p>
            </div>
          )}
        </div>

        {/* Timing Section */}
        {!isEditMode && (
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-lg font-semibold border-b pb-2">When to Send</h2>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sendTiming"
                  value="now"
                  checked={sendTiming === 'now'}
                  onChange={() => setSendTiming('now')}
                />
                Send Now
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sendTiming"
                  value="schedule"
                  checked={sendTiming === 'schedule'}
                  onChange={() => setSendTiming('schedule')}
                />
                Schedule for Later
              </label>
            </div>

            {sendTiming === 'schedule' && (
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
          </div>
        )}

        <div className="pt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/campaigns')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (type === 'email' && !emailTemplateId)}
            className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
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
  );
};

export default CreateCampaign;
