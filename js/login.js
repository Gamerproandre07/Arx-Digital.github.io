
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. CONEXIÓN CON SUPABASE
    // ==========================================

    const SUPABASE_URL =
        "https://ipxswlfragitdknatffc.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_UwSZ_MRdeUDhwyOVFd-ldQ_VIaHm8b1";

    if (!window.supabase) {
        console.error("No se cargó Supabase.");
        return;
    }

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


    // ==========================================
    // 2. ELEMENTOS DEL LOGIN
    // ==========================================

    const formularioLogin =
        document.querySelector(".login-card form");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const iconToggle =
        document.getElementById("iconToggle");

    const forgotPasswordLink =
        document.getElementById("forgotPasswordLink");


    // ==========================================
    // 3. MODALES DE RECUPERACIÓN
    // ==========================================

    const recoverEmailModal =
        document.getElementById("recoverEmailModal");

    const recoverEmailForm =
        document.getElementById("recoverEmailForm");

    const recoveryEmail =
        document.getElementById("recoveryEmail");

    const recoveryEmailMessage =
        document.getElementById("recoveryEmailMessage");

    const verificationModal =
        document.getElementById("verificationModal");

    const verificationForm =
        document.getElementById("verificationForm");

    const verificationCode =
        document.getElementById("verificationCode");

    const verificationMessage =
        document.getElementById("verificationMessage");

    const passwordModal =
        document.getElementById("passwordModal");

    const changePasswordForm =
        document.getElementById("changePasswordForm");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const passwordMessage =
        document.getElementById("passwordMessage");

    let correoRecuperacion = "";
    let recuperacionAutorizada = false;
    let procesando = false;


    // ==========================================
    // 4. MENSAJES
    // ==========================================

    function mostrarMensaje(elemento, texto, esError = false) {
        if (!elemento) return;

        elemento.textContent = texto;
        elemento.setAttribute("role", "status");
        elemento.setAttribute("aria-live", "polite");

        elemento.classList.remove(
            "password-error",
            "password-success"
        );

        elemento.classList.add(
            esError ? "password-error" : "password-success"
        );

        elemento.style.color =
            esError ? "#dc2626" : "#17618a";

        elemento.style.marginTop = "12px";
    }


    // ==========================================
    // 5. MOSTRAR Y OCULTAR CONTRASEÑA
    // ==========================================

    if (passwordInput && iconToggle) {
        iconToggle.addEventListener("click", () => {
            const mostrar =
                passwordInput.type === "password";

            passwordInput.type =
                mostrar ? "text" : "password";

            iconToggle.classList.toggle("fa-eye", mostrar);
            iconToggle.classList.toggle("fa-eye-slash", !mostrar);
        });
    }


    // ==========================================
    // 6. CONTROL DE MODALES
    // ==========================================

    const modales = [
        recoverEmailModal,
        verificationModal,
        passwordModal
    ];

    function abrirModal(modal) {
        if (!modal) return;

        modales.forEach(m => {
            if (m && m !== modal) {
                m.classList.remove("active");
                m.setAttribute("aria-hidden", "true");
            }
        });

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        const campo = modal.querySelector("input");
        if (campo) campo.focus();
    }

    function cerrarModal(modal) {
        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        const form = modal.querySelector("form");
        if (form) form.reset();

        const estado = modal.querySelector('[role="status"]');
        if (estado) mostrarMensaje(estado, "");
    }

    async function cancelarRecuperacion() {
        if (procesando) return;

        modales.forEach(cerrarModal);

        // Si se verificó el OTP, cerrar la sesión temporal
        if (recuperacionAutorizada) {
            try {
                await supabaseClient.auth.signOut();
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        }

        recuperacionAutorizada = false;
        correoRecuperacion = "";
    }


    // ==========================================
    // 7. INICIAR SESIÓN
    // ==========================================

    if (formularioLogin) {
        const mensajeLogin = document.createElement("p");

        mensajeLogin.setAttribute("role", "status");
        mensajeLogin.setAttribute("aria-live", "polite");

        formularioLogin.appendChild(mensajeLogin);

        formularioLogin.addEventListener("submit", async evento => {
            evento.preventDefault();

            if (!formularioLogin.reportValidity()) return;

            const boton = formularioLogin.querySelector(
                'button[type="submit"]'
            );

            if (boton.disabled) return;

            boton.disabled = true;
            boton.textContent = "Iniciando sesión...";

            try {
                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({
                        email: emailInput.value.trim(),
                        password: passwordInput.value
                    });

                if (error) throw error;

                if (!data.session) {
                    throw new Error("Sesión no disponible.");
                }

                mostrarMensaje(
                    mensajeLogin,
                    "Inicio de sesión exitoso."
                );

                passwordInput.value = "";

                window.location.replace("index.html");

            } catch (error) {
                console.error("Error de login:", error);

                mostrarMensaje(
                    mensajeLogin,
                    "No se pudo iniciar sesión. Verifica tus " +
                    "credenciales y la confirmación de tu correo.",
                    true
                );

                passwordInput.value = "";

            } finally {
                boton.disabled = false;
                boton.textContent = "Iniciar Sesión";
            }
        });
    }


    // ==========================================
    // 8. ABRIR RECUPERACIÓN
    // ==========================================

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", async evento => {
            evento.preventDefault();

            await cancelarRecuperacion();
            abrirModal(recoverEmailModal);
        });
    }


    // ==========================================
    // 9. ENVIAR CÓDIGO POR CORREO
    // ==========================================

    if (recoverEmailForm && recoveryEmail) {
        recoverEmailForm.addEventListener("submit", async evento => {
            evento.preventDefault();

            if (!recoverEmailForm.reportValidity()) return;

            const correo = recoveryEmail.value.trim();
            const boton = recoverEmailForm.querySelector(
                'button[type="submit"]'
            );

            if (boton.disabled) return;

            boton.disabled = true;
            procesando = true;
            boton.textContent = "Enviando...";

            try {
                const { error } =
                    await supabaseClient.auth.resetPasswordForEmail(
                        correo
                    );

                if (error) throw error;

                correoRecuperacion = correo;

                // Cerrar modal 1
                cerrarModal(recoverEmailModal);

                // Abrir modal 2 automáticamente
                abrirModal(verificationModal);

                mostrarMensaje(
                    verificationMessage,
                    "Si existe una cuenta asociada al correo, " +
                    "recibirás un código de recuperación."
                );

            } catch (error) {
                console.error(
                    "Error al enviar código:",
                    error
                );

                mostrarMensaje(
                    recoveryEmailMessage,
                    "No se pudo enviar la solicitud. " +
                    "Inténtalo nuevamente.",
                    true
                );

            } finally {
                procesando = false;
                boton.disabled = false;
                boton.textContent = "Continuar";
            }
        });
    }


    // ==========================================
    // 10. VERIFICAR CÓDIGO OTP
    // ==========================================

    if (verificationForm && verificationCode) {
        verificationForm.addEventListener("submit", async evento => {
            evento.preventDefault();

            if (!verificationForm.reportValidity()) return;
            if (!correoRecuperacion) return;

            const codigo = verificationCode.value.trim();

            const boton = verificationForm.querySelector(
                'button[type="submit"]'
            );

            if (boton.disabled) return;

            boton.disabled = true;
            procesando = true;
            boton.textContent = "Verificando...";

            try {
                const { data, error } =
                    await supabaseClient.auth.verifyOtp({
                        email: correoRecuperacion,
                        token: codigo,
                        type: "recovery"
                    });

                if (error) throw error;

                if (!data.session) {
                    throw new Error(
                        "No se recibió una sesión válida."
                    );
                }

                // Solo permitir el cambio tras verificar
                recuperacionAutorizada = true;

                // Cerrar modal 2
                cerrarModal(verificationModal);

                // Abrir modal 3
                abrirModal(passwordModal);

                mostrarMensaje(
                    passwordMessage,
                    "Código verificado. Ahora puedes " +
                    "establecer tu nueva contraseña."
                );

            } catch (error) {
                console.error("Error OTP:", error);

                mostrarMensaje(
                    verificationMessage,
                    "El código es incorrecto, ha expirado " +
                    "o no se pudo verificar.",
                    true
                );

            } finally {
                procesando = false;
                boton.disabled = false;
                boton.textContent = "Verificar código";
            }
        });
    }


    // ==========================================
    // 11. CAMBIAR CONTRASEÑA
    // ==========================================

    if (changePasswordForm && newPassword && confirmPassword) {
        changePasswordForm.addEventListener("submit", async evento => {
            evento.preventDefault();

            if (!recuperacionAutorizada) {
                mostrarMensaje(
                    passwordMessage,
                    "Primero debes verificar el código.",
                    true
                );
                return;
            }

            if (!changePasswordForm.reportValidity()) return;

            if (newPassword.value !== confirmPassword.value) {
                mostrarMensaje(
                    passwordMessage,
                    "Las contraseñas no coinciden.",
                    true
                );
                return;
            }

            const boton = changePasswordForm.querySelector(
                'button[type="submit"]'
            );

            if (boton.disabled) return;

            boton.disabled = true;
            procesando = true;
            boton.textContent = "Guardando...";

            try {
                const { error } =
                    await supabaseClient.auth.updateUser({
                        password: newPassword.value
                    });

                if (error) throw error;

                // Terminar la sesión de recuperación
                const { error: logoutError } =
                    await supabaseClient.auth.signOut();

                if (logoutError) throw logoutError;

                recuperacionAutorizada = false;
                correoRecuperacion = "";

                changePasswordForm.reset();

                mostrarMensaje(
                    passwordMessage,
                    "Contraseña actualizada correctamente. " +
                    "Ya puedes iniciar sesión."
                );

                cerrarModal(passwordModal);

                alert(
                    "Contraseña actualizada correctamente. " +
                    "Ahora inicia sesión."
                );

                window.location.replace("login.html");

            } catch (error) {
                console.error(
                    "Error al actualizar contraseña:",
                    error
                );

                mostrarMensaje(
                    passwordMessage,
                    "No se pudo completar la operación. " +
                    "Revisa la consola para más detalles.",
                    true
                );

            } finally {
                procesando = false;
                boton.disabled = false;
                boton.textContent = "Guardar nueva contraseña";
            }
        });
    }


    // ==========================================
    // 12. BOTONES PARA CERRAR MODALES
    // ==========================================

    const botonesCerrar = [
        "closeRecoverEmailModal",
        "cancelRecoverEmailModal",
        "closeVerificationModal",
        "cancelVerificationModal",
        "closePasswordModal",
        "cancelPasswordModal"
    ];

    botonesCerrar.forEach(id => {
        const boton = document.getElementById(id);

        if (boton) {
            boton.addEventListener("click", cancelarRecuperacion);
        }
    });


    // ==========================================
    // 13. CERRAR AL HACER CLIC FUERA
    // ==========================================

    modales.forEach(modal => {
        if (!modal) return;

        modal.addEventListener("click", evento => {
            if (evento.target === modal) {
                cancelarRecuperacion();
            }
        });
    });


    // ==========================================
    // 14. CERRAR CON ESCAPE
    // ==========================================

    document.addEventListener("keydown", evento => {
        if (evento.key !== "Escape") return;

        if (modales.some(m => m?.classList.contains("active"))) {
            cancelarRecuperacion();
        }
    });

});
