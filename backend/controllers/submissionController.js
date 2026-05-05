const Submission = require('../models/Submission');
const Test = require('../models/Test');

// @desc    Submit a test
// @route   POST /api/submissions
// @access  Private (Student)
const submitTest = async (req, res) => {
  const { testId, answers } = req.body;

  try {
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Auto-grade submission
    let score = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = test.questions.id(answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedOption;
      if (isCorrect) score += 1; // Basic scoring: 1 point per correct answer
      
      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect
      };
    });

    const submission = await Submission.create({
      test: testId,
      student: req.user._id,
      answers: gradedAnswers,
      score,
      // aiFeedback could be generated here async
    });

    res.status(201).json(submission);
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ message: 'You have already submitted this test' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's submissions
// @route   GET /api/submissions/me
// @access  Private
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('test', 'title description durationMinutes');
    
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get submissions for a specific test
// @route   GET /api/submissions/test/:testId
// @access  Private (Teacher/Admin/Expert)
const getTestSubmissions = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (test.creator.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view submissions for this test' });
    }

    const submissions = await Submission.find({ test: req.params.testId })
      .populate('student', 'name email');

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitTest, getMySubmissions, getTestSubmissions };
