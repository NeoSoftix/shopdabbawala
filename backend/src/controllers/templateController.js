import EmailTemplate from '../models/EmailTemplate.model.js';

// @desc    Create a new email template
// @route   POST /api/templates
// @access  Private/Admin
export const createTemplate = async (req, res) => {
  try {
    const { name, subject, htmlContent, designJson } = req.body;

    if (!name || !subject || !htmlContent || !designJson) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const template = new EmailTemplate({
      name,
      subject,
      htmlContent,
      designJson,
    });

    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error: error.message });
  }
};

// @desc    Get all email templates
// @route   GET /api/templates
// @access  Private/Admin
export const getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 }).select('-htmlContent -designJson');
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error: error.message });
  }
};

// @desc    Get single email template
// @route   GET /api/templates/:id
// @access  Private/Admin
export const getTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template', error: error.message });
  }
};

// @desc    Update email template
// @route   PUT /api/templates/:id
// @access  Private/Admin
export const updateTemplate = async (req, res) => {
  try {
    const { name, subject, htmlContent, designJson } = req.body;

    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.name = name || template.name;
    template.subject = subject || template.subject;
    template.htmlContent = htmlContent || template.htmlContent;
    template.designJson = designJson || template.designJson;

    const updatedTemplate = await template.save();
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error: error.message });
  }
};

// @desc    Delete email template
// @route   DELETE /api/templates/:id
// @access  Private/Admin
export const deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await template.deleteOne();
    res.status(200).json({ message: 'Template removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error: error.message });
  }
};
