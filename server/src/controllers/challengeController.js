const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const { runAnalysisForChallenge } = require('../services/ai/runAnalysis');
const Project = require('../models/Project');
const createChallenge = async (req, res) => {
    try {
        const {
            title,
            description,
            domain,
            subCategory,
            district,
            location,
            latitude,
            longitude,
            peopleAffected,
            expectedSolution,
            additionalInfo,
        } = req.body;

        if (!title || !description || !domain || !district) {
            return res
                .status(400)
                .json({ message: 'Title, description, domain, and district are required' });
        }

        const media = { photos: [], videos: [], documents: [] };
        if (req.files) {
            if (req.files.photos) {
                media.photos = req.files.photos.map((f) => `/uploads/${f.filename}`);
            }
            if (req.files.videos) {
                media.videos = req.files.videos.map((f) => `/uploads/${f.filename}`);
            }
            if (req.files.documents) {
                media.documents = req.files.documents.map((f) => `/uploads/${f.filename}`);
            }
        }

        const challenge = await Challenge.create({
            title,
            description,
            domain,
            subCategory,
            district,
            location,
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
            peopleAffected: peopleAffected ? Number(peopleAffected) : 0,
            expectedSolution,
            additionalInfo,
            media,
            submittedBy: req.user._id,
        });
        // Fire-and-forget: don't make the citizen wait for the LLM call.
        runAnalysisForChallenge(challenge._id).catch((err) => {
            console.error(`Background AI analysis failed for ${challenge._id}:`);
            console.error(err);
        });
        res.status(201).json({ challenge });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({ submittedBy: req.user._id }).sort({
            createdAt: -1,
        });
        res.status(200).json({ challenges });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChallenges = async (req, res) => {
    try {
        const {
            domain,
            district,
            priority,
            status,
            university,
            industryInvolvement,
            dateFrom,
            dateTo,
            search,
            page = 1,
            limit = 12,
        } = req.query;

        const match = {};
        if (domain) match.domain = domain;
        if (district) match.district = new RegExp(district, 'i');
        if (priority) match.priority = priority;
        if (status) match.status = status;
        if (university && mongoose.Types.ObjectId.isValid(university)) {
            match.assignedUniversity = new mongoose.Types.ObjectId(university);
        }
        if (dateFrom || dateTo) {
            match.createdAt = {};
            if (dateFrom) match.createdAt.$gte = new Date(dateFrom);
            if (dateTo) match.createdAt.$lte = new Date(dateTo);
        }
        if (search) {
            match.$text = { $search: search };
        }

        const pipeline = [
            { $match: match },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'project',
                    foreignField: '_id',
                    as: 'projectData',
                },
            },
            { $unwind: { path: '$projectData', preserveNullAndEmptyArrays: true } },
        ];

        if (industryInvolvement === 'true') {
            pipeline.push({
                $match: { 'projectData.industryPartners.0': { $exists: true } },
            });
        } else if (industryInvolvement === 'false') {
            pipeline.push({
                $match: {
                    $or: [
                        { projectData: null },
                        { 'projectData.industryPartners.0': { $exists: false } },
                    ],
                },
            });
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'universities',
                    localField: 'assignedUniversity',
                    foreignField: '_id',
                    as: 'universityData',
                },
            },
            { $unwind: { path: '$universityData', preserveNullAndEmptyArrays: true } },
            { $sort: { createdAt: -1 } },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) }
        );

        const challenges = await Challenge.aggregate(pipeline);
        const total = await Challenge.countDocuments(match);

        res.status(200).json({
            challenges,
            pagination: { page: Number(page), limit: Number(limit), total },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id)
            .populate('submittedBy', 'name email')
            .populate('assignedUniversity')
            .populate('recommendedUniversities.university')
            .populate('similarChallenges.challenge', 'title district status')
            .populate({
                path: 'project',
                populate: [{ path: 'industryPartners.partner' }, { path: 'university' }],
            });

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        res.status(200).json({ challenge });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        const isOwner = challenge.submittedBy.toString() === req.user._id.toString();
        const isPrivileged = ['admin', 'government'].includes(req.user.role);

        if (!isOwner && !isPrivileged) {
            return res.status(403).json({ message: 'Not authorized to update this challenge' });
        }

        const allowedFields = isPrivileged
            ? ['status', 'priority', 'assignedUniversity']
            : ['title', 'description', 'expectedSolution', 'additionalInfo'];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                challenge[field] = req.body[field];
            }
        });

        await challenge.save();
        res.status(200).json({ challenge });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        const isOwner = challenge.submittedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this challenge' });
        }

        await challenge.deleteOne();
        res.status(200).json({ message: 'Challenge deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createChallenge,
    getMyChallenges,
    getChallenges,
    getChallengeById,
    updateChallenge,
    deleteChallenge,
};