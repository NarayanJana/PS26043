const User = require('../models/User');
const University = require('../models/University');
const IndustryPartner = require('../models/IndustryPartner');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, organization } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'citizen',
            phone,
            organization,
        });

        if (user.role === 'university') {
            await University.create({
                user: user._id,
                name: organization?.name || user.name,
                type: organization?.type,
                address: organization?.address,
                contactPerson: organization?.contactPerson || user.name,
                contactEmail: user.email,
                contactPhone: user.phone,
            });
        }

        if (user.role === 'industry') {
            await IndustryPartner.create({
                user: user._id,
                name: organization?.name || user.name,
                industryType: organization?.type,
                address: organization?.address,
                contactPerson: organization?.contactPerson || user.name,
                contactEmail: user.email,
                contactPhone: user.phone,
            });
        }
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    res.status(200).json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            phone: req.user.phone,
            organization: req.user.organization,
        },
    });
};

module.exports = { register, login, getMe };