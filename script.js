function loginUser() {

    let email = document.querySelector('input[type="email"]').value;
    let password = document.querySelector('input[type="password"]').value;

    if(email === "admin@gmail.com" && password === "12345"){

        window.location.href = "dashboard.html";
        return false;

    }

    else{

        alert("Invalid Email or Password");
        return false;

    }

}