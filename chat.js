const API = "https://private-vault-backend.onrender.com";
const token = localStorage.getItem("token");

if (!token) window.location.replace("./login.html");

function loadMessages() {
  fetch(`${API}/api/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("chatBox");
    box.innerHTML = "";

    const myName = JSON.parse(atob(token.split(".")[1])).username;

    data.messages.forEach(m => {
      const cls = m.from === myName ? "me" : "other";
      box.innerHTML += `<div class="${cls}"><b>${m.from}:</b> ${m.text}</div>`;
    });

    box.scrollTop = box.scrollHeight;
  });
}

function sendMsg() {
  const text = document.getElementById("msg").value;

  fetch(`${API}/api/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  }).then(() => {
    document.getElementById("msg").value = "";
    loadMessages();
  });
}

loadMessages();
setInterval(loadMessages, 2000);
