const API="https://private-vault-backend.onrender.com";
const token=localStorage.getItem("token");
if(!token){
    window.location.href="login.html";
}
fetch("${API}/api/private",{
    headers:{Authorization:`Bearer ${token}`
    }
})
.then(res=>res.json())
.then(data=>{
    document.getElementById("message").innerText=data.message;
})
.catch(()=>{
    window.location.href="login.html";
});

function uploadMedia(){
    const fileInput=document.getElementById("media");
    const status=document.getElementById("uploadStatus");
    if(!fileInput.files.length===0){
        status.innerText="please select a file";
        return;
    }
    const formData=new FormData();
    formData.append("media",fileInput.files[0]);
    status.innerText="Uploading..";
    fetch("${API}/api/upload",{method:"POST",headers:{Authorization:`Bearer ${token}`},
    body:formData
})
.then(res => {
console.log("UPLOAD STATUS:", res.status);
return res.json();
})
.then(data => {
console.log("UPLOAD RESPONSE:", data);
status.innerText =data.message || "Upload completed ";
})
.catch(err => {
console.error("UPLOAD ERROR:", err);
status.innerText="upload failed";
});
}

function loadGallery(){
    fetch("${API}/api/media",{
        headers:{Authorization:`Bearer ${token}`}
    })
    .then(res=>res.json())
    .then(data=>{
        const gallery=document.getElementById("gallery");
        gallery.innerHTML="";

        data.files.forEach(file=>{
            if((/\.(jpg|jpeg|png|gif)$/i.test(file))){
                gallery.innerHTML+=`<div style="display:inline-block; margin:10px;text-align:center">
                <img src="${API}/uploads/${file}"width="200"/><br>
                <button onclick="deleteMedia('${file}')">Delete</button>
                </div>`;
            }else if((/\.(mp4|webm|ogg)$/i.test(file))){
                gallery.innerHTML+=`<div style="display:inline-block; margin:10px; text-align:center">
                <video width="250" controls>
                <source src="${API}/uploads/${file}"></video><br>
                <button onclick="deleteMedia('${file}')">Delete</button>
                </div>`;
            }
        });
    });
}

function logout(){
    localStorage.removeItem("token");
    window.location.href="/";
}
loadGallery();
function deleteMedia(filename){
    if (!confirm("Are you sure you want to delete this file?"))
        return;
    fetch(`${API}/api/delete/${filename}`,{
        method:"DELETE",headers:{Authorization:`Bearer ${token}`}
    })
    .then(res=>res.json())
    .then(data=>{
        alert(data.message);
        loadGallery();
    })
    .catch(()=>{
        alert("Delete failed");
    }); 
}