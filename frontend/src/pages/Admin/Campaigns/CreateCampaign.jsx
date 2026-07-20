import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampaign, sendCampaign } from '../../../services/campaignService';
import { getTemplates } from '../../../services/templateService';
import { toast } from 'react-hot-toast';

const CreateCampaign = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (type === 'email') {
      fetchTemplates();
    }
  }, [type]);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load templates');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create the campaign (draft)
      const campaignPayload = {
        name,
        type,
        filters: {
          role: roleFilter,
          isActive: isActiveFilter === 'true' ? true : isActiveFilter === 'false' ? false : undefined
        }
      };

      if (type === 'email') {
        campaignPayload.subject = subject;
        campaignPayload.emailTemplateId = emailTemplateId;
      } else {
        campaignPayload.messageContent = messageContent;
      }

      const newCampaign = await createCampaign(campaignPayload);

      // 2. Execute / Send the campaign
      const sendResult = await sendCampaign(newCampaign._id);
      
      toast.success(`Campaign started! Targeting ${sendResult.targetCount} users.`);
      navigate('/admin/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error executing campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>
      
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
            {isSubmitting ? 'Sending...' : 'Send Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
