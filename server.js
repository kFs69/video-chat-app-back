const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});
const {v4:uuidv4} = require('uuid');

const port = process.env.PORT || 4000;

app.use(express.json())

app.get('/' , (req,res) => {
  const roomId = uuidv4();

  res.json({ roomId });
});

io.on("connection" , (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)
    
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })

})

server.listen(port , () => {
  console.log("Server running on port : " + port);
})