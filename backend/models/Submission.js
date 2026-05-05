const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
  }
});

const submissionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  aiFeedback: {
    type: String
  }
}, { timestamps: true });

// Prevent multiple submissions by the same student for the same test
submissionSchema.index({ test: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
