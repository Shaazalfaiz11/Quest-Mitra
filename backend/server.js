const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const testRoutes = require('./routes/testRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/submissions', submissionRoutes);

const path = require('path');
const fs = require('fs');

// Serve frontend static files if they exist
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ status: 'Quest Mistra Backend is running' });
  });
}

// Socket.io connection and Battle Room logic
const battleRooms = new Map(); // { roomId: { users: [{ id, name, score }], started: boolean } }

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinBattleRoom', ({ roomId, user }) => {
    socket.join(roomId);
    
    if (!battleRooms.has(roomId)) {
      battleRooms.set(roomId, { users: [], started: false });
    }
    
    const room = battleRooms.get(roomId);
    const existingUser = room.users.find(u => u.userId === user._id);
    
    if (!existingUser) {
      room.users.push({ userId: user._id, name: user.name, score: 0, socketId: socket.id });
    }

    io.to(roomId).emit('roomUpdate', room.users);
  });

  socket.on('submitBattleAnswer', ({ roomId, userId, isCorrect }) => {
    const room = battleRooms.get(roomId);
    if (room) {
      const user = room.users.find(u => u.userId === userId);
      if (user && isCorrect) {
        user.score += 10;
        // Sort users by score descending
        room.users.sort((a, b) => b.score - a.score);
        io.to(roomId).emit('leaderboardUpdate', room.users);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from any rooms they were in
    for (const [roomId, room] of battleRooms.entries()) {
      const initialLength = room.users.length;
      room.users = room.users.filter(u => u.socketId !== socket.id);
      if (room.users.length < initialLength) {
        io.to(roomId).emit('roomUpdate', room.users);
      }
    }
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/questmistra';

// Start server FIRST so Render sees it as alive
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Then connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
