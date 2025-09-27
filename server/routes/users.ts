import { RequestHandler } from "express";
import { UserModel, CreateUserData } from "../database/models/MongoUser";
import { UserProgressModel } from "../database/models/MongoUserProgress";

// Create a new user
export const createUser: RequestHandler = async (req, res) => {
  try {
    const userData: CreateUserData = req.body;
    
    // Validate required fields
    if (!userData.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!userData.experience) {
      return res.status(400).json({ error: 'Experience level is required' });
    }
    
    if (!userData.time_commitment) {
      return res.status(400).json({ error: 'Time commitment is required' });
    }

    // Check if user with email already exists
    if (userData.email) {
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
    }

    const user = await UserModel.create(userData);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by ID
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Check if user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithEmail = await UserModel.findByEmail(updateData.email);
      if (userWithEmail) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await UserModel.update(userId, updateData);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user progress
export const getUserProgress: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const progress = await UserProgressModel.findByUserId(userId);
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user progress
export const updateUserProgress: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const progressData = req.body;

    // Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedProgress = await UserProgressModel.update(userId, progressData);
    res.json(updatedProgress);
  } catch (error) {
    console.error('Error updating user progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deleted = await UserModel.delete(userId);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List users (admin function)
export const listUsers: RequestHandler = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const users = await UserModel.list(
      parseInt(limit as string), 
      parseInt(offset as string)
    );
    
    const total = await UserModel.count();
    
    res.json({
      users,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search users
export const searchUsers: RequestHandler = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await UserModel.search(
      q as string, 
      parseInt(limit as string)
    );
    
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by email (for login)
export const getUserByEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update last active
    await UserModel.updateLastActive(user.id);

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
