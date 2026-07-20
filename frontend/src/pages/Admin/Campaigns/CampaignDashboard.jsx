import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCampaigns, deleteCampaign, scheduleCampaign, sendCampaign } from '../../../services/campaignService';
import { toast } from 'react-hot-toast';
import { Plus, Mail, MessageSquare, Pencil, Trash2, CalendarClock, Send } from 'lucide-react';

const CampaignDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleTargetId, setScheduleTargetId] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign? This cannot be undone.')) return;
    try {
      await deleteCampaign(id);
      toast.success('Campaign deleted');
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const handleSendNow = async (id) => {
    try {
      const result = await sendCampaign(id);
      toast.success(`Campaign started! Targeting ${result.targetCount} users.`);
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send campaign');
    }
  };

  const openScheduleModal = (id) => {
    setScheduleTargetId(id);
    setScheduleDate('');
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleDate) return;
    try {
      await scheduleCampaign(scheduleTargetId, new Date(scheduleDate).toISOString());
      toast.success('Campaign scheduled');
      setScheduleTargetId(null);
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule campaign');
    }
  };

  if (loading) return <div className="p-6">Loading campaigns...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <div className="flex gap-3">
          <Link
            to="/admin/campaigns/templates"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 border px-4 py-2 rounded hover:bg-gray-200"
          >
            Email Templates
          </Link>
          <Link
            to="/admin/campaigns/new"
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            <Plus size={18} />
            Create Campaign
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Type</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Success/Failed</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {campaigns.map((campaign) => {
              const isEditable = campaign.status === 'draft' || campaign.status === 'scheduled';
              const isDeletable = campaign.status !== 'in-progress';

              return (
                <tr key={campaign._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{campaign.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {campaign.type === 'email' ? <Mail size={12}/> : <MessageSquare size={12}/>}
                      {campaign.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`capitalize px-2 py-1 rounded text-xs font-semibold ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      campaign.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {campaign.status}
                    </span>
                    {campaign.status === 'scheduled' && campaign.scheduledAt && (
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(campaign.scheduledAt).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {campaign.successCount} / {campaign.failureCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {campaign.status === 'draft' && (
                        <button
                          title="Send now"
                          onClick={() => handleSendNow(campaign._id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {isEditable && (
                        <button
                          title="Schedule"
                          onClick={() => openScheduleModal(campaign._id)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <CalendarClock size={16} />
                        </button>
                      )}
                      {isEditable && (
                        <button
                          title="Edit"
                          onClick={() => navigate(`/admin/campaigns/${campaign._id}/edit`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {isDeletable && (
                        <button
                          title="Delete"
                          onClick={() => handleDelete(campaign._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No campaigns found. Create a new campaign to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {scheduleTargetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Schedule Campaign</h2>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <input
                type="datetime-local"
                required
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleTargetId(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDashboard;
