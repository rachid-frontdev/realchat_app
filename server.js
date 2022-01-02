const express = require('express');
const session = require('express-session');
const app = express();
const moment = require('moment');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const store = new session.MemoryStore()
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose'),
      path = require('path');
const authRoutes = require('./routes/users.js');
const homeRoutes = require('./routes/index.js')
const db = require('./db.js');

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:'no-one know',
  saveUninitialized:false,
  resave:false,
  cookie:{},
  store:store
}))
app.use(flash());
// passport Config
require('./passport.js')(passport),
app.use(passport.initialize());
app.use(passport.session());
app.get('*',(req,res,next) => {
  res.locals.user = req.user || null;
  next();
})

// for parsing multipart/form-data
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
db(); //connect with database
//show page
app.use(authRoutes);
// app.use(homeRoutes);


// app.post('/login', (req, res) => {
//   // console.log(req.sessionID);
//   const {email, password, password2} = req.body;
// if(email && password) {
//   if(req.session.authenticated) {
//     res.json(req.session);
//   } else {
//     if(password === password2) {
//       req.session.authenticated = true;
//       req.session.user = {
//         email,password
//       };
//       res.json(req.session);
//     } else {
//       res.status(403).json({msg:'bad Credential'});
//     }
//   }
//
// } else res.status(403).json({msg:'bad Credential'});
//
//   // res.json({email,password,confirm:password2});
//   // res.redirect('/');
// });

io.on('connection', socket => {
  socket.username = 'anonymous';


  socket.on("send-request", msg => {
    io.sockets.emit('send-request', {
      username:msg.username,
      message:msg.message,
      time:moment().format('h:mm a')
    });
  });

  //here start typing

  socket.on('send-user', dataUser => {
    socket.on("disconnect", () => {
      io.emit("message", `${dataUser} has left the chat`);
    });

        // socket.broadcast.emit("user-phrase", dataUser);
        io.emit("user-phrase", dataUser);

  });
});
server.listen(3000, () => {
  console.log('you are in port 3000');
});
//for error
app.use((req,res) => {
  res.send(`${req.method} - ${req.url}`)
})
