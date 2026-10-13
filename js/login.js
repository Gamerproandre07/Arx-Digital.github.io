document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const iconToggle = document.getElementById('iconToggle');

    if (passwordInput && iconToggle) {
        iconToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordLink =
        document.getElementById("forgotPasswordLink");

    const passwordModal =
        document.getElementById("passwordModal");

    const closePasswordModal =
        document.getElementById("closePasswordModal");

    const cancelPasswordModal =
        document.getElementById("cancelPasswordModal");

    const changePasswordForm =
        document.getElementById("changePasswordForm");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const passwordMessage =
        document.getElementById("passwordMessage");

    
    forgotPasswordLink.addEventListener("click", function (event) {
        event.preventDefault();

        passwordMessage.textContent = "";
        passwordModal.classList.add("active");
        passwordModal.setAttribute("aria-hidden", "false");

        newPassword.focus();
    });

    
    function closeModal() {
        passwordModal.classList.remove("active");
        passwordModal.setAttribute("aria-hidden", "true");
        changePasswordForm.reset();
        passwordMessage.textContent = "";
        passwordMessage.className = "";
    }

    closePasswordModal.addEventListener("click", closeModal);
    cancelPasswordModal.addEventListener("click", closeModal);

    
    passwordModal.addEventListener("click", function (event) {
        if (event.target === passwordModal) {
            closeModal();
        }
    });

    
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" &&
            passwordModal.classList.contains("active")) {
            closeModal();
        }
    });

    
    changePasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nueva = newPassword.value;
        const confirmar = confirmPassword.value;

        passwordMessage.className = "";

        if (nueva.length < 8) {
            passwordMessage.textContent =
                "La contraseña debe tener al menos 8 caracteres.";
            passwordMessage.classList.add("password-error");
            return;
        }

        if (nueva !== confirmar) {
            passwordMessage.textContent =
                "Las contraseñas no coinciden.";
            passwordMessage.classList.add("password-error");
            return;
        }

        passwordMessage.textContent =
            "Las contraseñas coinciden, Exito en guardar.";

        passwordMessage.classList.add("password-success");
    });
});
