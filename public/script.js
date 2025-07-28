function showMessage(msg, success = false, popup = false, redirectUrl = null) {
  if (popup && success) {
    // Nascondi il messaggio sotto il form
    const el = document.getElementById("message");
    if (el) {
      el.textContent = "";
      el.className = "message";
    }
    // Mostra il popup
    const popupEl = document.getElementById("popup");
    const popupMsg = document.getElementById("popup-message");
    const popupOk = document.getElementById("popup-ok");
    if (popupEl && popupMsg && popupOk) {
      popupMsg.textContent = msg;
      popupEl.style.display = "flex";
      // Rimuovi eventuali vecchi listener
      popupOk.onclick = null;
      popupOk.onclick = () => {
        popupEl.style.display = "none";
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      };
    }
  } else {
    const el = document.getElementById("message");
    if (!el) return;
    el.textContent = msg;
    el.className = "message" + (success ? " success" : "");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const usernameInput = document.getElementById("username");
  if (emailInput && usernameInput) {
    emailInput.addEventListener("input", () => {
      usernameInput.value = emailInput.value;
    });
  }

  const regForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const data = {
        nome: document.getElementById("nome").value,
        cognome: document.getElementById("cognome").value,
        email: email,
        username: email, // username = email
        password: document.getElementById("password").value
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const msg = await res.json();
      if (res.ok) {
        showMessage(
          msg.message + `. Il tuo username sarà la tua email: ${email}`,
          true,
          true,
          "index.html"
        );        
      } else {
        showMessage(msg.message, false);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
      };

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const msg = await res.json();
      showMessage(msg.message, res.ok);
      if (res.ok) {
        sessionStorage.setItem("user", JSON.stringify(msg.user));
        sessionStorage.setItem("username", msg.user.username);
        showMessage(msg.message, true, true, "home.html"); // popup
      }
    });
  }
});
