import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const usernameRef = document.querySelectorAll(".username");
const roomNameRef = document.querySelectorAll(".room-name");
const activeUsersRef = document.querySelector(".active-users");
const chat = document.querySelector(".room");
const chatForm = document.querySelector(".chat-form");
const leaveBtn = document.querySelector('.nav-actions button')

const socket = io();
let socketConnected = false;

let username;
let room;

socket.on("connect", () => {
  socketConnected = socket.connected;
});

const urlParams = new URLSearchParams(location.search);

for (const [key, value] of urlParams) {
  if (key === "username") {
    username = value;
  }
  if (key === "rooms") {
    room = value;
  }
}

usernameRef.forEach((ref) => {
  ref.innerHTML = username;
});
roomNameRef.forEach((ref) => {
  ref.innerHTML = room;
});

socket.emit("joinChat", {
  username,
  room,
});

socket.on("activeUsers", (data) => {
  activeUsersRef.innerHTML = "";
  data.users.forEach((user) => {
    activeUsersRef.innerHTML += `<div class='active-user ${user.id === socket.id ? "active" : ""}'>
    <i class="fa-solid fa-user"></i> &nbsp;<span>${user.username}</span>
    </div>`;
  });
});

socket.on("message", (data) => {
  const isAdmin = data.sender === "RCA";
  chat.innerHTML += `<div class='${isAdmin ? '' : `chat-container ${data.sender.id === socket.id ? 'active' : ''}`}'>
  <div class='room-message ${isAdmin ? "rca" : `message ${data.sender.id === socket.id ? 'active' : ''}`}'>
    <p class='chat-info'><b>${isAdmin ? data.sender : data.sender.username}</b> at ${data.time}</p>
    <p class='chat-message'>${isAdmin ? "- " : ""}${data.message}${isAdmin ? " -" : ""}</p> 
  </div>
  </div>`;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("chatMessage", chatForm.message.value);
  chatForm.reset()
});

leaveBtn.addEventListener("click", e => {
  e.preventDefault()
  socket.disconnect()
  window.location = "http://localhost:3000"
})
