import React, { useState, useContext } from 'react';
import { Plus, Trash2, ArrowLeft, Save, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TestCreation = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [test, setTest] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    questions: [
      { text: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'Medium', explanation: '' }
    ]
  });

  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setTest({
      ...test,
      questions: [
        ...test.questions,
        { text: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'Medium', explanation: '' }
      ]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...test.questions];
    newQuestions.splice(index, 1);
    setTest({ ...test, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...test.questions];
    newQuestions[index][field] = value;
    setTest({ ...test, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...test.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setTest({ ...test, questions: newQuestions });
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      setError('Please enter a topic to generate questions.');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      
      const { data } = await axios.post('/api/tests/generate', {
        topic: aiTopic,
        numQuestions: 3,
        difficulty: 'Medium'
      }, config);
      
      setTest(prev => ({
        ...prev,
        // If the only question is the empty default one, replace it. Otherwise append.
        questions: prev.questions.length === 1 && prev.questions[0].text === '' 
          ? data 
          : [...prev.questions, ...data]
      }));
      setAiTopic('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions. Is your API key valid?');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!test.title) {
      setError('Test title is required');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      
      await axios.post('/api/tests', test, config);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save test');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Assessment</h1>
          <p className="text-sm text-slate-500">Add questions manually or generate them with AI.</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* AI Generator Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 shadow-sm mb-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Auto-Generate with AI</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">Let our AI create high-quality multiple choice questions based on your topic.</p>
        <div className="flex gap-3">
          <input 
            type="text" 
            className="flex-1 px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white"
            placeholder="e.g. Newton's Laws of Motion, Cellular Biology..."
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
          />
          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-70 whitespace-nowrap"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {isGenerating ? 'Generating...' : 'Generate 3 Questions'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Test Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Test Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g. Midterm Physics Exam"
              value={test.title}
              onChange={(e) => setTest({...test, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              rows="2"
              placeholder="Instructions for the students..."
              value={test.description}
              onChange={(e) => setTest({...test, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Minutes)</label>
            <input 
              type="number" 
              className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={test.durationMinutes}
              onChange={(e) => setTest({...test, durationMinutes: parseInt(e.target.value)})}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {test.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => removeQuestion(qIndex)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                title="Remove question"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-md font-bold text-slate-800 mb-4">Question {qIndex + 1}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  rows="2"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Option {oIndex + 1}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer (Exact Match)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-green-50"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    placeholder="Must exactly match one of the options"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={q.difficulty}
                    onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={addQuestion}
          className="flex items-center px-4 py-2 border border-dashed border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 font-medium transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Manual Question
        </button>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-sm transition-colors disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {isSaving ? 'Saving...' : 'Save Assessment'}
        </button>
      </div>
    </div>
  );
};

export default TestCreation;
