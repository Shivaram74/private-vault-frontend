const API="https://private-vault-backend.onrender.com";
function login(){
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;
    fetch("${API}/api/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username:username,
            password:password
        })
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.token){
            document.getElementById("result").innerText="Login Successful";
            localStorage.setItem("token",data.token);
        }else{
            document.getElementById("result").innerText="Login Failed";
        }
    })
    .catch(error=>{
        console.error(error)
    })
}