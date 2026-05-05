const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  conceptTags: [{
    type: String
  }]
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedToGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  questions: [questionSchema],
  durationMinutes: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  isLive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
