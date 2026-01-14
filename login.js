const API="https://private-vault-backend.onrender.com";
async function login(){
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;
    try{
        const res =awaits fetch(`${API}/api/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username:username,
            password:password
        })
    });
    if(!res.ok){
        const text=await res.text();
        throw new error(text|| "Login failed");
    }
    const data=await res.json();

    localStorage.setItem("token",data.token);
    window.location.href="dashboard.html";
}catch(err){
    console.error(err);
    document.getElementById("result").innerText="Invalid credentials";
}
}
