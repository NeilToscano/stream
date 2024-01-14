const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { v4: uuidV4} = require('uuid');

app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room})
});

io.on('connection', (socket) => {

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.to('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    })
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
