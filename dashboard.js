const API = "https://private-vault-backend.onrender.com";
const token = localStorage.getItem("token");

console.log("DASHBOARD TOKEN:", token);

// ✅ Auth check
if (!token || token === "undefined") {
    window.location.replace("login.html");
}

// ✅ Private route check
fetch(`${API}/api/private`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
.then(res => {
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.replace("login.html");
        return;
    }
    return res.json();
})
.then(data => {
    if (!data) return;
    document.getElementById("message").innerText = data.message;
})
.catch(err => {
    console.error("PRIVATE API ERROR:", err);
    // ❌ DO NOT redirect here
});

// ================= UPLOAD =================
function uploadMedia() {
    const fileInput = document.getElementById("media");
    const status = document.getElementById("uploadStatus");

    if (!fileInput.files.length) {
        status.innerText = "Please select a file";
        return;
    }

    const formData = new FormData();
    formData.append("media", fileInput.files[0]);

    status.innerText = "Uploading...";

    fetch(`${API}/api/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            window.location.replace("login.html");
            return;
        }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        status.innerText = data.message || "Upload completed";
        loadGallery();
    })
    .catch(err => {
        console.error("UPLOAD ERROR:", err);
        status.innerText = "Upload failed";
    });
}

// ================= GALLERY =================
function loadGallery() {
    fetch(`${API}/api/media`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            window.location.replace("login.html");
            return;
        }
        return res.json();
    })
    .then(data => {
        if (!data) return;

        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";

        data.files.forEach(file => {
            if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
                gallery.innerHTML += `
                <div style="display:inline-block;margin:10px;text-align:center">
                    <img src="${API}/uploads/${file}" width="200"/><br>
                    <button onclick="deleteMedia('${file}')">Delete</button>
                </div>`;
            } else if (/\.(mp4|webm|ogg)$/i.test(file)) {
                gallery.innerHTML += `
                <div style="display:inline-block;margin:10px;text-align:center">
                    <video width="250" controls>
                        <source src="${API}/uploads/${file}">
                    </video><br>
                    <button onclick="deleteMedia('${file}')">Delete</button>
                </div>`;
            }
        });
    })
    .catch(err => {
        console.error("LOAD GALLERY ERROR:", err);
    });
}

// ================= DELETE =================
function deleteMedia(filename) {
    if (!confirm("Are you sure you want to delete this file?")) return;

    fetch(`${API}/api/delete/${filename}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadGallery();
    })
    .catch(() => {
        alert("Delete failed");
    });
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
}

loadGallery();
