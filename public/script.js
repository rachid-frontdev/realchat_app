 const socket = io();
let username = prompt('please enter username');
 let sendContain = document.querySelector('.send-container');
  let messageForm = document.getElementById('messageContainer');
  let inputTxt = document.getElementById('message-input');
  let sendbtn = document.getElementById('send-btn');
  let listUsers = document.querySelector('.list_Users');
  let leaveRoom = document.getElementById('leave');

if (username != null) {
  socket.emit('send-user', username);
}

  socket.on("user-phrase", dataname => {
    let li = document.createElement('li');
    li.innerHTML = `${dataname}`;
    return listUsers.append(li);
    // return document.body.append(div);
  });

  socket.on("send-request", (data) => {
    let div = document.createElement('div');
    div.classList.add("one-container");
    div.innerHTML = `<h4 class="name-user">${data.username}  <span class="meta">${data.time}</span></h4>
      <p class="msg"> ${data.message}</p>`;
    messageForm.append(div);
  });

  sendbtn.addEventListener('click', () => {


    if (inputTxt.value) {
      console.log('send it to server');
      socket.emit('send-request', {
        message:inputTxt.value,
        username:username
      });
      inputTxt.value = '';
      inputTxt.focus();
    }

  })
    socket.on('message', (data) => {
      let div = document.createElement('div');
      div.classList.add("one-container",'warning');
      div.innerHTML = `<h4 class="name-user">Chatbot <span class="meta">9:12pm</span></h4>
        <p class="msg"> ${data}</p>`;
      messageForm.append(div);

    });

//     leaveRoom.onclick = () => {
// }

  //here start typing
  // inputTxt.value.bind('keypress', () => {
    //   socket.emit('typing');
    // })
    // socket.on('typing', (data) => {
      //   feedback.innerHTML = `<p> <i>${data.username} is typing a message ...</i> </p>`;
      // })
