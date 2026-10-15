"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const formularioLogin = document.querySelector(".login-card form");
    const passwordInput = document.getElementById("password");
    const iconToggle = document.getElementById("iconToggle");
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");

    const recoverEmailModal = document.getElementById("recoverEmailModal");
    const recoverEmailForm = document.getElementById("recoverEmailForm");
    const recoveryEmail = document.getElementById("recoveryEmail");
    const recoveryEmailMessage =
        document.getElementById("recoveryEmailMessage");

    const passwordModal = document.getElementById("passwordModal");
    const changePasswordForm =
        document.getElementById("changePasswordForm");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const passwordMessage = document.getElementById("passwordMessage");

    // Mostrar u ocultar la contraseña.
    if (passwordInput && iconToggle) {
        iconToggle.addEventListener("click", function () {
            const mostrar = passwordInput.type === "password";

            passwordInput.type = mostrar ? "text" : "password";
            iconToggle.classList.toggle("fa-eye", mostrar);
            iconToggle.classList.toggle("fa-eye-slash", !mostrar);
        });
    }

    function mostrarMensaje(elemento, texto, esError = false) {
        if (!elemento) return;

        elemento.textContent = texto;
        elemento.classList.remove("password-error", "password-success");

        if (esError) {
            elemento.classList.add("password-error");
        }

        elemento.setAttribute("role", "status");
        elemento.setAttribute("aria-live", "polite");
    }

    function abrirModal(modal) {
        if (!modal) return;

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        const primerCampo = modal.querySelector("input");
        if (primerCampo) primerCampo.focus();
    }

    function cerrarModal(modal) {
        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const formulario = modal.querySelector("form");
        if (formulario) formulario.reset();

        const mensaje = modal.querySelector('[role="status"]');
        if (mensaje) mostrarMensaje(mensaje, "");
    }

    // Demostración del inicio de sesión: no envía datos.
    if (formularioLogin) {
        const mensajeLogin = document.createElement("p");
        mensajeLogin.setAttribute("role", "status");
        mensajeLogin.setAttribute("aria-live", "polite");
        formularioLogin.appendChild(mensajeLogin);

        formularioLogin.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (!formularioLogin.reportValidity()) return;

            mostrarMensaje(
                mensajeLogin,
                "Demostración académica: el inicio de sesión todavía " +
                "no está disponible. No se ha iniciado ninguna sesión " +
                "ni enviado los datos."
            );

            if (passwordInput) passwordInput.value = "";
        });
    }

    // Abrir únicamente la ventana para solicitar el correo.
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function (evento) {
            evento.preventDefault();

            cerrarModal(passwordModal);
            mostrarMensaje(recoveryEmailMessage, "");
            abrirModal(recoverEmailModal);
        });
    }

    // Configurar botones para cerrar las ventanas.
    const botonesCerrar = [
        ["closeRecoverEmailModal", recoverEmailModal],
        ["cancelRecoverEmailModal", recoverEmailModal],
        ["closePasswordModal", passwordModal],
        ["cancelPasswordModal", passwordModal]
    ];

    botonesCerrar.forEach(function ([id, modal]) {
        const boton = document.getElementById(id);

        if (boton) {
            boton.addEventListener("click", function () {
                cerrarModal(modal);
                if (forgotPasswordLink) forgotPasswordLink.focus();
            });
        }
    });

    // Cerrar al pulsar fuera del contenido.
    [recoverEmailModal, passwordModal].forEach(function (modal) {
        if (!modal) return;

        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) {
                cerrarModal(modal);
                if (forgotPasswordLink) forgotPasswordLink.focus();
            }
        });
    });

    // Cerrar con Escape.
    document.addEventListener("keydown", function (evento) {
        if (evento.key !== "Escape") return;

        const abierta = [recoverEmailModal, passwordModal].find(
            modal => modal && modal.classList.contains("active")
        );

        if (abierta) {
            cerrarModal(abierta);
            if (forgotPasswordLink) forgotPasswordLink.focus();
        }
    });

    // Validación de ejemplo: no envía correos ni códigos.
    if (recoverEmailForm && recoveryEmail) {
        recoverEmailForm.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (!recoverEmailForm.reportValidity()) return;

            mostrarMensaje(
                recoveryEmailMessage,
                "Demostración académica: el formato del correo es válido. " +
                "No se ha comprobado si existe una cuenta ni se ha " +
                "enviado un código. La recuperación aún no está disponible."
            );

            recoverEmailForm.reset();
        });
    }

    // Se conserva la validación para la futura implementación.
    // No se abre esta ventana como si el correo ya estuviera verificado.
    if (changePasswordForm && newPassword && confirmPassword) {
        changePasswordForm.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (!changePasswordForm.reportValidity()) return;

            if (newPassword.value.length < 8) {
                mostrarMensaje(
                    passwordMessage,
                    "La contraseña de prueba debe tener al menos 8 caracteres.",
                    true
                );
                return;
            }

            if (newPassword.value !== confirmPassword.value) {
                mostrarMensaje(
                    passwordMessage,
                    "Las contraseñas de prueba no coinciden.",
                    true
                );
                return;
            }

            mostrarMensaje(
                passwordMessage,
                "Validación de ejemplo correcta. No se ha guardado " +
                "ni cambiado ninguna contraseña."
            );

            changePasswordForm.reset();
        });
    }
});
