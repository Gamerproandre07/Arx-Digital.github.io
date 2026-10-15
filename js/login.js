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

document.addEventListener("DOMContentLoaded", function () {
    // Modal para solicitar el correo
    const recoverEmailModal =
        document.getElementById("recoverEmailModal");

    const recoverEmailForm =
        document.getElementById("recoverEmailForm");

    const recoveryEmail =
        document.getElementById("recoveryEmail");

    const recoveryEmailMessage =
        document.getElementById("recoveryEmailMessage");

    const closeRecoverEmailModal =
        document.getElementById("closeRecoverEmailModal");

    const cancelRecoverEmailModal =
        document.getElementById("cancelRecoverEmailModal");

    // Modal para cambiar la contraseña
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

    // Enlace "¿Olvidaste tu contraseña?"
    // Ajusta el selector si tu enlace usa otro identificador.
    const forgotPasswordLink =
        document.querySelector(".forgot-password");

    // Abrir modal de recuperación
    function openRecoverEmailModal(event) {
        if (event) {
            event.preventDefault();
        }

        closeModal(passwordModal);
        recoveryEmailMessage.textContent = "";
        recoveryEmailMessage.className = "";

        openModal(recoverEmailModal);
        recoveryEmail.focus();
    }

    // Abrir y cerrar modales
    function openModal(modal) {
        if (!modal) return;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }

    // Conectar enlace de recuperación
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener(
            "click",
            openRecoverEmailModal
        );
    }

    // Cerrar modal de correo
    closeRecoverEmailModal.addEventListener("click", function () {
        closeModal(recoverEmailModal);
    });

    cancelRecoverEmailModal.addEventListener("click", function () {
        closeModal(recoverEmailModal);
    });

    // Cerrar modal de cambio de contraseña
    closePasswordModal.addEventListener("click", function () {
        closeModal(passwordModal);
    });

    cancelPasswordModal.addEventListener("click", function () {
        closeModal(passwordModal);
    });

    // Cerrar al hacer clic en el fondo
    [recoverEmailModal, passwordModal].forEach(function (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Enviar correo: falta conectar el servicio de recuperación.
    recoverEmailForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = recoveryEmail.value.trim();

        recoveryEmailMessage.className = "";
        recoveryEmailMessage.textContent = "";

        if (!recoveryEmail.checkValidity() || !email) {
            recoveryEmailMessage.textContent =
                "Introduce un correo electrónico válido.";
            recoveryEmailMessage.classList.add("password-error");
            recoveryEmail.focus();
            return;
        }

        recoveryEmailMessage.textContent =
            "El formulario está listo, pero falta conectar el servicio " +
            "que envía y verifica el código de recuperación.";

        recoveryEmailMessage.classList.add("password-error");
    });

    // Validación de la nueva contraseña.
    // Esta validación NO guarda la contraseña en el servidor.
    changePasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nueva = newPassword.value;
        const confirmar = confirmPassword.value;

        passwordMessage.className = "";
        passwordMessage.textContent = "";

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
            "Las contraseñas coinciden, pero falta conectarlas " +
            "al sistema seguro para guardar la contraseña.";

        passwordMessage.classList.add("password-error");
    });

    // Permitir cerrar las ventanas con Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal(recoverEmailModal);
            closeModal(passwordModal);
        }
    });
});
