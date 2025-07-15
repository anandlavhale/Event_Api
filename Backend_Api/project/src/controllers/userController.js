import User from '../models/User.js';
import { userSchema } from '../utils/validation.js';

export const createUser = async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    const { name, email } = req.body;
    const user = await User.create({ name, email });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    const updatedUser = await User.update(id, req.body);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.delete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
