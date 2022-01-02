const DB_Url = 'mongodb://localhost:27017/chat-app';
const mongoose = require('mongoose');
module.exports = () => {
  function connect() {
    mongoose.connect(DB_Url, function(err) {
      if(err) console.error('mongoose connection err', err);
      console.log('connected to database');
    })
  }
  connect();
  mongoose.connection.on('disconnect',connect);

}
