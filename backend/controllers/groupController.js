const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
  const { name, description } = req.body;

  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const group = await Group.create({
      name,
      description,
      creator: req.user._id,
      members: [req.user._id],
      inviteCode,
    });

    // Add group to user's groups
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id }
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Join a group via invite code
// @route   POST /api/groups/join
// @access  Private
const joinGroup = async (req, res) => {
  const { inviteCode } = req.body;

  try {
    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    group.members.push(req.user._id);
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id }
    });

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Private
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('creator', 'name email')
      .populate('members', 'name email');

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createGroup, joinGroup, getMyGroups };
