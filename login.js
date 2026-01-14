const API_BASE = "https://private-vault-backend.onrender.com";

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const result = document.getElementById("result");

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    localStorage.setItem("token", data.token);
    console.log("TOKEN SAVED:",
    localStorage.getItem("token"));
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    result.innerText = "Invalid username or password";
  }
}