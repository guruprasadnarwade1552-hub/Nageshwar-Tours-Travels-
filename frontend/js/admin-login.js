const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const button = loginForm.querySelector("button");

    loginMessage.textContent = "";

    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging In...';

    try {

        const response = await fetch("https://nageshwar-tours-travels-production.up.railway.app/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (data.success) {

            // Save JWT
            localStorage.setItem("adminToken", data.token);

            // Save Admin Info
            localStorage.setItem(
                "adminUser",
                JSON.stringify(data.admin)
            );

            loginMessage.style.color = "#00ff99";
            loginMessage.textContent = "Login Successful ✓";

            setTimeout(() => {

                window.location.href = "admin.html";

            }, 1200);

        } else {

            loginMessage.style.color = "#ff5555";
            loginMessage.textContent = data.message;

        }

    } catch (err) {

        console.error(err);

        loginMessage.style.color = "#ff5555";
        loginMessage.textContent = "Cannot connect to server.";

    }

    button.disabled = false;
    button.innerHTML = "Login";

});
