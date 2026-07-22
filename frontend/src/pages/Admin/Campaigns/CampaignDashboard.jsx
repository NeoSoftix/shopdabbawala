import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit, MdSend } from 'react-icons/md';
import { HiOutlineClock } from 'react-icons/hi';
import { getCampaigns, deleteCampaign, scheduleCampaign, sendCampaign } from '../../../services/campaignService';
import { toast } from 'react-hot-toast';
import { Mail, MessageSquare, FileText } from 'lucide-react';
import { SectionLoader } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';
import { confirmDeleteToast } from '../../../utils/confirmDeleteToast';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const statusStyles = {
  completed: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-sky-100 text-sky-700',
  scheduled: 'bg-amber-100 text-amber-700',
  failed: 'bg-rose-100 text-rose-700',
};

const CampaignDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleTargetId, setScheduleTargetId] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCampaigns(page);
  }, [page]);

  const fetchCampaigns = async (pageNum = page) => {
    try {
      setLoading(true);
      const data = await getCampaigns(pageNum);
      setCampaigns(data.campaigns || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmDeleteToast('Delete this campaign?', async () => {
      try {
        await deleteCampaign(id);
        toast.success('Campaign deleted successfully.');
        fetchCampaigns(page);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete campaign.');
      }
    });
  };

  const handleSendNow = async (id) => {
    try {
      const result = await sendCampaign(id);
      toast.success(`Campaign started! Targeting ${result.targetCount} users.`);
      fetchCampaigns(page);
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
      fetchCampaigns(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule campaign');
    }
  };

  return (
    <div className="px-5 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage email &amp; SMS campaigns.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/campaigns/templates"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-gray-700 transition hover:bg-gray-50"
          >
            <FileText size={15} />
            Email Templates
          </Link>
          <Button onClick={() => navigate('/admin/campaigns/new')} className="!rounded-full">
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-4">Name</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Success/Failed</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {campaigns.map((campaign) => {
              const isEditable = campaign.status === 'draft' || campaign.status === 'scheduled';
              const isDeletable = campaign.status !== 'in-progress';

              return (
                <tr key={campaign._id} className="hover:bg-gray-50/40 transition-colors duration-150">
                  <td className="py-2.5 px-4 text-sm font-semibold text-gray-800">{campaign.name}</td>

                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        campaign.type === 'email' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {campaign.type === 'email' ? <Mail size={12} /> : <MessageSquare size={12} />}
                      {campaign.type.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-2.5 px-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[campaign.status] || 'bg-gray-100 text-gray-600'}`}>
                      {campaign.status}
                    </span>
                    {campaign.status === 'scheduled' && campaign.scheduledAt && (
                      <div className="text-[11px] text-gray-400 mt-1">
                        {new Date(campaign.scheduledAt).toLocaleString()}
                      </div>
                    )}
                  </td>

                  <td className="py-2.5 px-4 text-sm text-gray-500 font-medium">
                    <span className="text-emerald-600">{campaign.successCount}</span>
                    {' / '}
                    <span className="text-rose-600">{campaign.failureCount}</span>
                  </td>

                  <td className="py-2.5 px-4 text-sm text-gray-400">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {campaign.status === 'draft' && (
                        <button
                          onClick={() => handleSendNow(campaign._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                          aria-label="Send now"
                          title="Send now"
                        >
                          <MdSend size={15} />
                        </button>
                      )}
                      {isEditable && (
                        <button
                          onClick={() => openScheduleModal(campaign._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition hover:bg-amber-100"
                          aria-label="Schedule campaign"
                          title="Schedule"
                        >
                          <HiOutlineClock size={15} />
                        </button>
                      )}
                      {isEditable && (
                        <button
                          onClick={() => navigate(`/admin/campaigns/${campaign._id}/edit`)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                          aria-label="Edit campaign"
                          title="Edit"
                        >
                          <MdEdit size={15} />
                        </button>
                      )}
                      {isDeletable && (
                        <button
                          onClick={() => handleDelete(campaign._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                          aria-label="Delete campaign"
                          title="Delete"
                        >
                          <MdDelete size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {loading && (
              <tr>
                <td colSpan="6">
                  <SectionLoader text="Loading campaigns..." />
                </td>
              </tr>
            )}

            {!loading && campaigns.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-sm text-gray-400">
                  No campaigns found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={!!scheduleTargetId} onClose={() => setScheduleTargetId(null)} showCloseButton>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Schedule Campaign</h2>
        <p className="text-sm text-gray-500 mb-4">Pick a future date and time to send this campaign.</p>

        <form onSubmit={handleScheduleSubmit}>
          <Input
            label="Date & Time"
            type="datetime-local"
            required
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            wrapperClassName="mb-4"
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setScheduleTargetId(null)}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CampaignDashboard;



