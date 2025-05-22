import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms.set(roomCode, { host: socket.id, users: [socket.id] });
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
  });

  socket.on('joinRoom', (roomCode) => {
    const room = rooms.get(roomCode);
    if (room) {
      room.users.push(socket.id);
      socket.join(roomCode);
      socket.emit('roomJoined', roomCode);
      socket.to(roomCode).emit('userJoined', socket.id);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('hostVideoInfo', ({ roomCode, name, size }) => {
    socket.to(roomCode).emit('hostVideoInfo', { name, size });
  });

  socket.on('videoAction', ({ roomCode, action, time }) => {
    socket.to(roomCode).emit('videoAction', { action, time });
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, code) => {
      if (room.users.includes(socket.id)) {
        room.users = room.users.filter(id => id !== socket.id);
        if (room.users.length === 0) {
          rooms.delete(code);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 