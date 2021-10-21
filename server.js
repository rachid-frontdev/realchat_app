// const io = require('socket.io')(3000);
// app.use(express.json());
// app.listen('3000', () => {
//   console.log('connected server in port 3000');

// });
const express = require('express');
const app = express();
const moment = require('moment');
// authonticate
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));
// app.set('view engine', 'ejs');
app.get('/', (req,res) => {
res.render('base', {title:'login system'})
})
server.listen(3000, () => {
  console.log('you are in port 3000');
});

io.on('connection', socket => {
  socket.username = 'anonymous';

  socket.on("send-request", msg => {
    io.sockets.emit('send-request', {
      username:msg.username,
      message:msg.message,
      time:moment().format('h:mm a')
    });
    // socket.broadcast.emit("chat-msg", {
    //   username:msg.username,
    //   message:msg.message
    // });
  });

  //here start typing
  // socket.on('typing', data => {
  //   socket.broadcast.emit('typing', {username:socket.username});
  // })

  socket.on('send-user', dataUser => {
    socket.on("disconnect", () => {
      io.emit("message", `${dataUser} has left the chat`);
    });

        // socket.broadcast.emit("user-phrase", dataUser);
        io.emit("user-phrase", dataUser);

  });
});
