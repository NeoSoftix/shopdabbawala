import React, { useRef, useState, useEffect } from 'react';
import EmailEditor from 'react-email-editor';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createTemplate, getTemplateById, updateTemplate } from '../../../services/templateService';

const TemplateBuilder = () => {
  const emailEditorRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      loadExistingTemplate();
    }
  }, [id]);

  const loadExistingTemplate = async () => {
    try {
      const template = await getTemplateById(id);
      setName(template.name);
      setSubject(template.subject);
      
      // Load design into editor once it's ready
      if (emailEditorRef.current?.editor) {
        emailEditorRef.current.editor.loadDesign(template.designJson);
      } else {
        // If editor isn't ready yet, save it and load on load callback
        window.tempDesignToLoad = template.designJson;
      }
    } catch (error) {
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  const onLoad = () => {
    if (window.tempDesignToLoad) {
      emailEditorRef.current?.editor?.loadDesign(window.tempDesignToLoad);
      delete window.tempDesignToLoad;
    }
  };

  const saveDesign = () => {
    if (!name || !subject) {
      return toast.error('Please provide a Template Name and Subject');
    }

    setIsSaving(true);
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { design, html } = data;
      
      try {
        const payload = {
          name,
          subject,
          htmlContent: html,
          designJson: design,
        };

        if (id) {
          await updateTemplate(id, payload);
          toast.success('Template updated successfully!');
        } else {
          await createTemplate(payload);
          toast.success('Template created successfully!');
          navigate('/admin/campaigns/templates');
        }
      } catch (error) {
        toast.error('Error saving template');
      } finally {
        setIsSaving(false);
      }
    });
  };

  if (isLoading) return <div className="p-6">Loading template...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Template Name (e.g. Winter Sale)"
            className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email Subject"
            className="border rounded px-3 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/admin/campaigns/templates')}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={saveDesign} 
            disabled={isSaving}
            className="px-4 py-2 text-white bg-orange-600 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : (id ? 'Update Template' : 'Save Template')}
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-50 flex flex-col h-full min-h-[700px]">
        <EmailEditor 
          ref={emailEditorRef} 
          onLoad={onLoad} 
          minHeight="100%"
          style={{ height: '100%', minHeight: '80vh' }}
        />
      </div>
    </div>
  );
};

export default TemplateBuilder;
