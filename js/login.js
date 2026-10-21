"use strict";

document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // CONEXIÓN CON SUPABASE
    // ==========================================

    const SUPABASE_URL =
        "https://ipxswlfragitdknatffc.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_UwSZ_MRdeUDhwyOVFd-ldQ_VIaHm8b1";

    // Verificar que la biblioteca esté disponible
    if (!window.supabase) {
        console.error("No se cargó la biblioteca de Supabase.");
        return;
    }

    // Crear el cliente de Supabase
    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const formularioLogin = document.querySelector(".login-card form");
    const passwordInput = document.getElementById("password");
    
    if (passwordInput) {
        passwordInput.value = "";
    }

    window.addEventListener("pageshow", () => {
        if (passwordInput) {
            passwordInput.value = "";
        }
    });
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

    
        recoverEmailForm.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        if (!recoverEmailForm.reportValidity()) return;

        const correo = recoveryEmail.value.trim();

        const boton = recoverEmailForm.querySelector(
        'button[type="submit"]'
        );

    boton.disabled = true;
    boton.textContent = "Enviando...";

    try {
        const urlRetorno = new URL(
            "login.html",
            window.location.href
        ).href;

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(
                correo,
                {
                    redirectTo: urlRetorno
                }
            );

        if (error) throw error;

        mostrarMensaje(
            recoveryEmailMessage,
            "Si existe una cuenta asociada a este correo, " +
            "recibirás un enlace para restablecer tu contraseña."
        );

        recoverEmailForm.reset();

    } catch (error) {
        console.error("Error de recuperación:", error);

        mostrarMensaje(
            recoveryEmailMessage,
            "No se pudo procesar la solicitud. Inténtalo nuevamente.",
            true
        );

    } finally {
        boton.disabled = false;
        boton.textContent = "Continuar";
    }
});



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
