const Test = require('../models/Test');
const Group = require('../models/Group');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private (Teacher/Admin/Expert)
const createTest = async (req, res) => {
  const { title, description, questions, durationMinutes, startTime, endTime } = req.body;

  try {
    const test = await Test.create({
      title,
      description,
      creator: req.user._id,
      questions,
      durationMinutes,
      startTime,
      endTime
    });

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign test to groups
// @route   POST /api/tests/:id/assign
// @access  Private (Teacher/Admin/Expert)
const assignTest = async (req, res) => {
  const { groupIds } = req.body;
  const testId = req.params.id;

  try {
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (test.creator.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to assign this test' });
    }

    // Add new groups, ensuring uniqueness
    const updatedGroups = [...new Set([...test.assignedToGroups.map(id => id.toString()), ...groupIds])];
    test.assignedToGroups = updatedGroups;
    
    await test.save();

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tests for a specific group
// @route   GET /api/tests/group/:groupId
// @access  Private
const getTestsForGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Ensure user is in the group or is the creator
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user._id) && group.creator.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized to view tests for this group' });
    }

    const tests = await Test.find({ assignedToGroups: groupId }).select('-questions.correctAnswer');
    
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Generate questions using OpenAI
// @route   POST /api/tests/generate
// @access  Private (Teacher/Admin/Expert)
const generateQuestionsWithAI = async (req, res) => {
  const { topic, numQuestions = 3, difficulty = 'Medium' } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  try {
    const prompt = `Generate ${numQuestions} multiple-choice questions about "${topic}" at a ${difficulty} difficulty level.
Return the response STRICTLY as a JSON array of objects. Do not include any markdown formatting, backticks, or other text outside the JSON array.
Each object must have the following structure:
{
  "text": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The exact string of the correct option",
  "explanation": "A short explanation of why the answer is correct",
  "difficulty": "${difficulty}",
  "conceptTags": ["Tag1", "Tag2"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiContent = response.choices[0].message.content.trim();
    let questions;
    
    try {
      // In case the AI still wraps it in markdown, strip it
      const cleanedContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
      questions = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", aiContent);
      return res.status(500).json({ message: 'Failed to parse AI response', error: parseError.message });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ message: 'Error generating questions with AI', error: error.message });
  }
};

module.exports = { createTest, assignTest, getTestsForGroup, generateQuestionsWithAI };
