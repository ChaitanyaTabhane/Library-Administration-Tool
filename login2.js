// login_script.js
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Replace these hardcoded values with your actual login credentials
        const validUsername = "admin";
        const validPassword = "admin";

        if (username === validUsername && password === validPassword) {
            // Redirect to the main page after successful login
            window.location.href = "index.html";
        } else {
            // Display an error message
            alert("Invalid username or password. Please try again.");
        }
    });
});