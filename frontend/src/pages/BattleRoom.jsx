import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Clock, Users, Swords, Zap } from 'lucide-react';

// Connect to the backend socket
const socket = io();

// Mock Battle Question
const mockQuestion = {
  text: 'What is the powerhouse of the cell?',
  options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
  correctAnswer: 'Mitochondria'
};

const BattleRoom = () => {
  const { user } = useContext(AuthContext);
  const [roomId, setRoomId] = useState('math-battle-101');
  const [joined, setJoined] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [question, setQuestion] = useState(mockQuestion);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    socket.on('roomUpdate', (users) => {
      setLeaderboard(users.sort((a, b) => b.score - a.score));
    });

    socket.on('leaderboardUpdate', (users) => {
      setLeaderboard(users);
    });

    return () => {
      socket.off('roomUpdate');
      socket.off('leaderboardUpdate');
    };
  }, []);

  useEffect(() => {
    if (joined && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      // Mock next question load
      setTimeout(() => {
        setTimeLeft(15);
        setAnswered(false);
        setSelectedOption(null);
      }, 3000);
    }
  }, [joined, timeLeft]);

  const handleJoin = () => {
    socket.emit('joinBattleRoom', { roomId, user: { _id: user._id || Math.random().toString(), name: user.name } });
    setJoined(true);
  };

  const handleAnswer = (option) => {
    if (answered) return;
    
    setSelectedOption(option);
    setAnswered(true);
    
    const isCorrect = option === question.correctAnswer;
    
    if (isCorrect) {
      socket.emit('submitBattleAnswer', { roomId, userId: user._id, isCorrect: true });
    }
  };

  if (!joined) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 text-center">
          <div className="mx-auto w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
            <Swords className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Join a Battle Room</h1>
          <p className="text-slate-500 mb-8">Compete against your peers in real-time!</p>
          
          <input 
            type="text"
            className="w-full px-4 py-3 mb-4 border border-slate-300 rounded-lg text-center font-mono text-lg focus:ring-purple-500 focus:border-purple-500"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room Code"
          />

          <button 
            onClick={handleJoin}
            className="w-full bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-sm flex items-center justify-center"
          >
            <Zap className="w-5 h-5 mr-2" />
            Join Battle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex gap-6">
      {/* Main Battle Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between mb-6">
          <div className="flex items-center text-slate-700 font-bold">
            <Swords className="w-5 h-5 mr-2 text-purple-600" />
            Room: <span className="ml-2 font-mono bg-slate-100 px-2 py-1 rounded">{roomId}</span>
          </div>
          <div className={`flex items-center px-4 py-2 rounded-lg font-bold ${timeLeft <= 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock className="w-5 h-5 mr-2" />
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          {timeLeft === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Time's Up!</h2>
              <p className="text-slate-500 text-lg">Loading next question...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center leading-snug">
                {question.text}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectAnswer = option === question.correctAnswer;
                  
                  let btnClass = 'border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-700';
                  
                  if (answered) {
                    if (isCorrectAnswer) {
                      btnClass = 'border-green-500 bg-green-50 text-green-700';
                    } else if (isSelected && !isCorrectAnswer) {
                      btnClass = 'border-red-500 bg-red-50 text-red-700';
                    } else {
                      btnClass = 'border-slate-200 bg-slate-50 text-slate-400 opacity-50';
                    }
                  } else if (isSelected) {
                    btnClass = 'border-purple-600 bg-purple-50 text-purple-900';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={answered}
                      className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium text-lg flex items-center ${btnClass}`}
                    >
                      <div className={`w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center mr-4 font-bold ${answered && isCorrectAnswer ? 'text-green-600' : 'text-slate-400'}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {option}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center font-bold text-slate-800">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Leaderboard
          </div>
          <div className="flex items-center text-sm font-medium text-slate-500">
            <Users className="w-4 h-4 mr-1" />
            {leaderboard.length}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {leaderboard.map((u, idx) => (
            <div key={u.socketId} className={`flex items-center p-3 rounded-lg border ${u.userId === user._id ? 'border-purple-300 bg-purple-50' : 'border-slate-100 bg-white'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {u.name} {u.userId === user._id && '(You)'}
                </p>
              </div>
              <div className="font-mono font-bold text-purple-600 ml-2">
                {u.score}
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="text-center text-sm text-slate-500 mt-10">
              Waiting for players...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleRoom;
