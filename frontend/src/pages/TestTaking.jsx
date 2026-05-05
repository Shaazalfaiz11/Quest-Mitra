import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

// Mock Test Data
const mockTest = {
  _id: 'test_123',
  title: 'Midterm Physics Exam',
  durationMinutes: 30,
  questions: [
    {
      _id: 'q1',
      text: 'What is the SI unit of Force?',
      options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    },
    {
      _id: 'q2',
      text: 'Which law states that for every action, there is an equal and opposite reaction?',
      options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Universal Gravitation"],
    },
    {
      _id: 'q3',
      text: 'What is the formula for calculating kinetic energy?',
      options: ['E = mc^2', 'KE = 1/2 mv^2', 'F = ma', 'PE = mgh'],
    }
  ]
};

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(mockTest); // In reality, fetch using testId
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      handleSubmit();
      return;
    }
    
    if (!submitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option) => {
    setAnswers({
      ...answers,
      [test.questions[currentQuestionIndex]._id]: option
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mock API Call
    setTimeout(() => {
      // Basic mock grading
      const mockCorrectAnswers = { q1: 'Newton', q2: "Newton's Third Law", q3: 'KE = 1/2 mv^2' };
      let calculatedScore = 0;
      Object.keys(answers).forEach(qId => {
        if (answers[qId] === mockCorrectAnswers[qId]) calculatedScore++;
      });
      
      setScore(calculatedScore);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Test Submitted!</h1>
          <p className="text-slate-500 mb-8">Your answers have been successfully recorded and auto-graded.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 max-w-sm mx-auto">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Your Score</p>
            <p className="text-5xl font-black text-purple-600">{score} <span className="text-2xl text-slate-400">/ {test.questions.length}</span></p>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{test.title}</h1>
          <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
        </div>
        
        <div className={`flex items-center px-4 py-2 rounded-lg font-bold ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
          <Clock className="w-5 h-5 mr-2" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-purple-600 h-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex) / test.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-8 leading-snug">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion._id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-purple-600 bg-purple-50 text-purple-900 font-medium shadow-sm' 
                    : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-purple-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-purple-600"></div>}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={isFirstQuestion}
          className="flex items-center px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            className="flex items-center px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-bold hover:bg-purple-200 transition-colors"
          >
            Next Question
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(answers).length < test.questions.length}
            className="flex items-center px-8 py-3 bg-purple-600 text-white rounded-lg font-bold shadow-sm hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        )}
      </div>
      
      {Object.keys(answers).length < test.questions.length && isLastQuestion && (
        <div className="mt-4 flex items-center justify-end text-amber-600 text-sm font-medium">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          You have unanswered questions
        </div>
      )}
    </div>
  );
};

export default TestTaking;
