import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns } from '../../../services/campaignService';
import { toast } from 'react-hot-toast';
import { Plus, Mail, MessageSquare } from 'lucide-react';

const CampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

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
            </tr>
          </thead>
          <tbody className="divide-y">
            {campaigns.map((campaign) => (
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
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {campaign.successCount} / {campaign.failureCount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No campaigns found. Create a new campaign to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignDashboard;
