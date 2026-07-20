import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTemplates, deleteTemplate } from '../../../services/templateService';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(id);
        toast.success('Template deleted');
        fetchTemplates();
      } catch (error) {
        toast.error('Error deleting template');
      }
    }
  };

  if (loading) return <div className="p-6">Loading templates...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Link 
          to="/admin/campaigns/templates/new"
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          <Plus size={18} />
          Create Template
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template._id} className="bg-white rounded-lg shadow border p-5">
            <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-1">{template.subject}</p>
            <div className="flex gap-3 mt-4 pt-4 border-t">
              <Link 
                to={`/admin/campaigns/templates/${template._id}`}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={14} /> Edit
              </Link>
              <button 
                onClick={() => handleDelete(template._id)}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border text-gray-500">
            No templates found. Create your first email template!
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;
