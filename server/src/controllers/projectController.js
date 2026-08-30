const Project = require('../models/Project');
const Challenge = require('../models/Challenge');
const Milestone = require('../models/Milestone');
const IndustryPartner = require('../models/IndustryPartner');
const University = require('../models/University');
const { createNotification } = require('../services/notificationService');

const MILESTONE_STAGES = ['Research', 'Design', 'Prototype', 'Testing', 'Pilot', 'Deployment'];

const createProject = async (req, res) => {
    try {
        const { challengeId } = req.body;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        if (challenge.assignedUniversity?.toString() !== req.university._id.toString()) {
            return res.status(403).json({ message: 'This challenge is not assigned to your university' });
        }
        if (challenge.project) {
            return res.status(400).json({ message: 'A project already exists for this challenge' });
        }

        const project = await Project.create({
            title: challenge.title,
            challenge: challenge._id,
            university: req.university._id,
        });

        const milestones = await Milestone.insertMany(
            MILESTONE_STAGES.map((stage, i) => ({
                project: project._id,
                stage,
                order: i + 1,
                status: i === 0 ? 'in_progress' : 'pending',
            }))
        );

            challenge.project = project._id;
    challenge.status = 'project_created';
    await challenge.save();

    // Broadcast the new opportunity to every industry account. This is a
    // simple broadcast rather than an expertise-matched notification,
    // since IndustryPartner profiles don't currently declare "required
    // expertise" in a form comparable to Challenge.aiAnalysis — only
    // sectorsOfInterest/capabilities, which aren't matched against a
    // project's needs anywhere else in the app either. Worth revisiting
    // if industry-side matching gets built out later.
    const industryPartners = await IndustryPartner.find().select('user');
    industryPartners.forEach((partner) => {
      createNotification({
        recipient: partner.user,
        title: 'New project available',
        message: `A university project matching your expertise is available: "${project.title}".`,
        type: 'industry_interest',
        relatedProject: project._id,
      });
    });

    res.status(201).json({ project, milestones });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const filter = req.university ? { university: req.university._id } : {};
        const projects = await Project.find(filter)
            .populate('challenge', 'title domain district status')
            .sort({ createdAt: -1 });
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('challenge')
            .populate('university')
            .populate('industryPartners.partner')
            .populate('updates.postedBy', 'name role');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const milestones = await Milestone.find({ project: project._id }).sort({ order: 1 });

        res.status(200).json({ project, milestones });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (
            req.university &&
            project.university.toString() !== req.university._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        const { students, facultyMentor, status, socialImpact } = req.body;

        if (students !== undefined) project.students = students;
        if (facultyMentor !== undefined) project.facultyMentor = facultyMentor;
        if (status !== undefined) project.status = status;
        if (socialImpact !== undefined) project.socialImpact = socialImpact;

        await project.save();
        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProjectUpdate = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.updates.unshift({ text: req.body.text, postedBy: req.user._id });
        await project.save();

        res.status(201).json({ updates: project.updates });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadProjectDocuments = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newDocs = (req.files || []).map((f) => ({
            name: f.originalname,
            url: `/uploads/${f.filename}`,
            uploadedBy: req.user._id,
        }));

        project.documents.push(...newDocs);
        await project.save();

        res.status(201).json({ documents: project.documents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateIndustryPartnerStatus = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.university.toString() !== req.university._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to manage this project' });
        }

        const entry = project.industryPartners.id(req.params.partnerId);
        if (!entry) {
            return res.status(404).json({ message: 'Industry partner entry not found' });
        }

        entry.status = req.body.status;
        await project.save();

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addProjectUpdate,
  uploadProjectDocuments,
  updateIndustryPartnerStatus,
};