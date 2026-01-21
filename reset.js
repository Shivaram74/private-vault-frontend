const API = "https://private-vault-backend.onrender.com";

function resetPassword() {
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const status = document.getElementById("status");

  if (!oldPassword || !newPassword || !confirmPassword) {
    status.innerText = "All fields required";
    return;
  }

  if (newPassword !== confirmPassword) {
    status.innerText = "Passwords do not match";
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  fetch(`${API}/api/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ oldPassword, newPassword })
  })
    .then(res => res.json())
    .then(data => {
      status.innerText = data.message || "Done";

      if (data.message && data.message.toLowerCase().includes("success")) {
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "login.html";
        }, 1500);
      }
    })
    .catch(() => {
      status.innerText = "Server error";
    });
}
