import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen } from 'lucide-react';

const suggestedQuestions = [
  "Explain Newton's Third Law with examples",
  "What is the difference between speed and velocity?",
  "How does photosynthesis work?",
  "Solve: If F = 10N and m = 2kg, find acceleration",
];

const AiTutor = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Study Buddy 🤖. I can help you understand concepts, solve problems, and prepare for your tests. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMockResponse = (question) => {
    const q = question.toLowerCase();
    if (q.includes('newton') && q.includes('third')) {
      return "**Newton's Third Law** states:\n\n> *For every action, there is an equal and opposite reaction.*\n\nThis means that forces always come in pairs. When object A exerts a force on object B, object B simultaneously exerts a force equal in magnitude but opposite in direction on object A.\n\n**Examples:**\n1. 🚀 **Rocket Launch** — The rocket pushes exhaust gases downward (action), and the gases push the rocket upward (reaction).\n2. 🏊 **Swimming** — You push water backward with your hands (action), and the water pushes you forward (reaction).\n3. 🚶 **Walking** — Your foot pushes backward on the ground (action), and the ground pushes your foot forward (reaction).\n\nWould you like me to explain the other laws as well?";
    }
    if (q.includes('speed') && q.includes('velocity')) {
      return "Great question! Here's the difference:\n\n| Property | Speed | Velocity |\n|----------|-------|----------|\n| **Type** | Scalar | Vector |\n| **Direction** | No | Yes |\n| **Formula** | Distance / Time | Displacement / Time |\n| **Can be negative?** | No | Yes |\n\n**Key Insight:** Speed tells you *how fast* something moves, while velocity tells you *how fast and in what direction*.\n\n**Example:** A car going around a circular track at 60 km/h has constant *speed* but changing *velocity* (because direction keeps changing).";
    }
    if (q.includes('photosynthesis')) {
      return "**Photosynthesis** is the process by which green plants convert light energy into chemical energy.\n\n**Equation:**\n```\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n```\n\n**Steps:**\n1. **Light Reactions** (in Thylakoids) — Water is split, O₂ is released, ATP & NADPH are produced.\n2. **Calvin Cycle** (in Stroma) — CO₂ is fixed into glucose using ATP & NADPH.\n\n**Key factors affecting photosynthesis:**\n- 🌞 Light intensity\n- 🌡️ Temperature\n- 💨 CO₂ concentration\n- 💧 Water availability";
    }
    if (q.includes('f =') || q.includes('acceleration') || q.includes('f=10')) {
      return "Let's solve this step by step!\n\n**Given:**\n- Force (F) = 10 N\n- Mass (m) = 2 kg\n\n**Formula:** F = ma → a = F/m\n\n**Solution:**\n```\na = F / m\na = 10 / 2\na = 5 m/s²\n```\n\n**Answer:** The acceleration is **5 m/s²** 🎯\n\nThis uses **Newton's Second Law of Motion**. Would you like more practice problems?";
    }
    return "That's a great question! Based on your course material, here's what I can tell you:\n\nThis topic involves understanding the fundamental concepts and their applications. I recommend:\n\n1. 📖 Review your class notes on this topic\n2. 🧪 Try solving practice problems\n3. 📊 Check your Analytics page to see if this falls in your weak zones\n\nWould you like me to break down any specific part of this concept?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateMockResponse(input);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSuggestedQuestion = (q) => {
    setInput(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Study Buddy</h1>
            <p className="text-xs text-green-500 font-medium">● Online — Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedQuestion(q)}
              className="bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-sm text-slate-600 px-3 py-2 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-purple-600" />
              ) : (
                <User className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'assistant' 
                ? 'bg-slate-50 text-slate-800 rounded-tl-none' 
                : 'bg-purple-600 text-white rounded-tr-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-purple-600" />
            </div>
            <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm shadow-sm pr-12"
            placeholder="Ask me anything about your subjects..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiTutor;
