const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.utils');

/**
 * User Controller
 * Handles all user-related operations
 */
class UserController {
    // Method to get all users
    static async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            res.json({ users });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to get a single user by ID
    static async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to register a new user
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            // Create new user - password will be hashed by the pre-save hook
            const newUser = new User({
                username,
                email,
                password
            });
            
            const savedUser = await newUser.save();
            
            // Don't return the password
            const userResponse = {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt
            };
            
            res.status(201).json({ user: userResponse });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to login a user
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            // Validate password using the model method
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            // Generate JWT token
            const token = generateToken({ id: user._id, email: user.email });
            
            res.json({ 
                token, 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email 
                } 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to insert a user (same as register but named differently)
    static async insertUser(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            // Create new user - password will be hashed by the pre-save hook
            const newUser = new User({
                username,
                email,
                password
            });
            
            const savedUser = await newUser.save();
            
            // Don't return the password
            const userResponse = {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt
            };
            
            res.status(201).json({ user: userResponse });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to update a user
    static async updateUser(req, res) {
        try {
            const { username, email, password } = req.body;
            const updates = {};
            
            if (username) updates.username = username;
            if (email) updates.email = email;
            if (password) updates.password = password;
            
            // Find and update user - if password included, it will be hashed by pre-save hook
            let updatedUser;
            
            if (password) {
                // If updating password, need to retrieve user first, update, and save
                // to trigger the password hashing middleware
                const user = await User.findById(req.params.id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                
                if (username) user.username = username;
                if (email) user.email = email;
                if (password) user.password = password;
                
                updatedUser = await user.save();
            } else {
                // For non-password updates, we can use findByIdAndUpdate
                updatedUser = await User.findByIdAndUpdate(
                    req.params.id,
                    { $set: updates },
                    { new: true }
                ).select('-password');
            }
            
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Method to delete a user
    static async deleteUser(req, res) {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;