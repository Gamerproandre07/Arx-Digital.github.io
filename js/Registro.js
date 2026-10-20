"use strict";

// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "https://ipxswlfragitdknatffc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UwSZ_MRdeUDhwyOVFd-ldQ_VIaHm8b1";

// Inicializar cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", function () {
    // SELECCIONAR LOS ELEMENTOS DEL FORMULARIO
    const formulario = document.querySelector(".registro form");
    const nombre = document.querySelector("#nombre");
    const correo = document.querySelector("#correo");
    const clave = document.querySelector("#clave");
    const confirmarClave = document.querySelector("#clave2");
    const aceptarTerminos = document.querySelector("#acepto-terminos");

    if (!formulario || !clave || !confirmarClave) {
        console.error("Faltan elementos críticos del formulario en el DOM.");
        return;
    }

    // CREAR UN ESPACIO PARA LOS MENSAJES
    const mensajeFormulario = document.createElement("p");
    mensajeFormulario.className = "mensaje-formulario";
    mensajeFormulario.setAttribute("role", "status");
    mensajeFormulario.setAttribute("aria-live", "polite");
    formulario.appendChild(mensajeFormulario);

    // FUNCIÓN PARA ENVOLVER EL INPUT Y AGREGAR EL BOTÓN DE VISIBILIDAD
    function agregarBotonVisibilidad(inputElement, nombreCampo) {
        if (!inputElement || inputElement.parentElement.classList.contains("password-wrapper")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "password-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.display = "block";
        wrapper.style.width = "100%";

        inputElement.parentNode.insertBefore(wrapper, inputElement);
        wrapper.appendChild(inputElement);

        inputElement.style.paddingRight = "40px";
        inputElement.style.boxSizing = "border-box";

        const botonToggle = document.createElement("button");
        botonToggle.type = "button";
        botonToggle.className = "toggle-visibilidad";
        botonToggle.setAttribute("aria-label", `Mostrar u ocultar ${nombreCampo}`);
        
        botonToggle.style.position = "absolute";
        botonToggle.style.right = "12px";
        botonToggle.style.top = "50%";
        botonToggle.style.transform = "translateY(-50%)";
        botonToggle.style.background = "transparent";
        botonToggle.style.border = "none";
        botonToggle.style.cursor = "pointer";
        botonToggle.style.color = "#666666";
        botonToggle.style.fontSize = "1rem";
        botonToggle.style.padding = "0";

        const icono = document.createElement("i");
        icono.className = "fa-solid fa-eye-slash";
        
        botonToggle.appendChild(icono);
        wrapper.appendChild(botonToggle);

        botonToggle.addEventListener("click", function () {
            const tipoActual = inputElement.getAttribute("type");
            const nuevoTipo = tipoActual === "password" ? "text" : "password";
            inputElement.setAttribute("type", nuevoTipo);

            icono.classList.toggle("fa-eye");
            icono.classList.toggle("fa-eye-slash");
        });
    }

    // VALIDAR Y COMPARAR LAS CONTRASEÑAS
    function validarContrasenas() {
        const contrasena = clave.value;
        const confirmacion = confirmarClave.value;

        if (confirmacion === "") {
            confirmarClave.setCustomValidity("");
            return;
        }

        if (contrasena !== confirmacion) {
            confirmarClave.setCustomValidity("Las contraseñas no coinciden.");
        } else {
            confirmarClave.setCustomValidity("");
        }
    }

    clave.addEventListener("input", validarContrasenas);
    confirmarClave.addEventListener("input", validarContrasenas);

    agregarBotonVisibilidad(clave, "contraseña");
    agregarBotonVisibilidad(confirmarClave, "confirmación de contraseña");

    
    // ==============================================
    // INDICADOR DE SEGURIDAD DE CONTRASEÑA
    // ==============================================

    const indicador = document.createElement("div");
    indicador.className = "indicador-clave";
    indicador.setAttribute("aria-live", "polite");

    const textoSeguridad = document.createElement("p");
    textoSeguridad.className = "texto-seguridad";

    const barraSeguridad = document.createElement("div");
    barraSeguridad.className = "barra-seguridad";

    const progresoSeguridad = document.createElement("div");
    progresoSeguridad.className = "progreso-seguridad";

    barraSeguridad.appendChild(progresoSeguridad);
    indicador.append(barraSeguridad, textoSeguridad);

    // Colocar el indicador debajo de la contraseña
    clave.parentElement.parentElement.appendChild(indicador);


    // ==============================================
    // EVALUAR LA SEGURIDAD DE LA CONTRASEÑA
    // ==============================================

    function evaluarContrasena(valor) {

        let puntos = 0;

        if (valor.length >= 8) puntos++;
        if (valor.length >= 12) puntos++;

        if (/[a-z]/.test(valor) && /[A-Z]/.test(valor)) {
            puntos++;
        }

        if (/\d/.test(valor)) puntos++;

        if (/[^A-Za-z0-9]/.test(valor)) puntos++;

        return puntos;
    }


    

    function actualizarSeguridad() {

        const valor = clave.value;
        const puntos = evaluarContrasena(valor);

        let nivel = "Débil";
        let porcentaje = 25;

        if (valor.length === 0) {

            textoSeguridad.textContent = "";
            progresoSeguridad.style.width = "0%";
            progresoSeguridad.style.backgroundColor = "transparent";

            return;
        }

        if (valor.length < 8) {

            nivel = "Demasiado corta";
            porcentaje = 15;

        } else if (puntos <= 2) {

            nivel = "Débil";
            porcentaje = 35;

        } else if (puntos <= 3) {

            nivel = "Media";
            porcentaje = 65;

        } else {

            nivel = "Fuerte";
            porcentaje = 100;
        }

        textoSeguridad.textContent =
            `Seguridad estimada: ${nivel}`;

        progresoSeguridad.style.width = `${porcentaje}%`;

        if (porcentaje <= 35) {

            progresoSeguridad.style.backgroundColor = "#ef4444";

        } else if (porcentaje <= 65) {

            progresoSeguridad.style.backgroundColor = "#f59e0b";

        } else {

            progresoSeguridad.style.backgroundColor = "#22c55e";
        }
    }

    // Actualizar mientras se escribe
    clave.addEventListener("input", actualizarSeguridad);


  

    const campos = formulario.querySelectorAll(".campo input");

    campos.forEach(function (campo) {

        // Cuando el usuario selecciona un campo
        campo.addEventListener("focus", function () {

            campo.classList.add("campo-activo");

        });

        // Cuando el usuario sale del campo
        campo.addEventListener("blur", function () {

            campo.classList.remove("campo-activo");

        });

    });


 
    // ==========================================
    // REGISTRAR USUARIOS CON SUPABASE AUTH
    // ==========================================

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        // Validar contraseñas
        validarContrasenas();

        // Verificar campos obligatorios
        if (!formulario.reportValidity()) {
            return;
        }

        // Verificar contraseñas iguales
        if (clave.value !== confirmarClave.value) {

            confirmarClave.setCustomValidity(
                "Las contraseñas no coinciden."
            );

            confirmarClave.reportValidity();
            confirmarClave.focus();
            return;
        }

        // Verificar aceptación de términos
        if (!aceptarTerminos || !aceptarTerminos.checked) {

            mensajeFormulario.textContent =
                "Debes aceptar los Términos y Condiciones.";

            mensajeFormulario.className =
                "mensaje-formulario mensaje-error";

            aceptarTerminos?.focus();
            return;
        }

        // Obtener los datos
        const nombreUsuario = nombre.value.trim();
        const correoUsuario = correo.value.trim();
        const contrasenaUsuario = clave.value;

        // Botón de registro
        const botonSubmit =
            formulario.querySelector('button[type="submit"]');

        if (botonSubmit?.disabled) return;

        if (botonSubmit) {
            botonSubmit.disabled = true;
            botonSubmit.textContent = "Registrando...";
        }

        mensajeFormulario.textContent =
            "Creando cuenta de manera segura...";

        mensajeFormulario.className = "mensaje-formulario";

        try {

            // URL de retorno después de confirmar
            const urlLogin = new URL(
                "login.html",
                window.location.href
            ).href;

            // CREAR CUENTA CON SUPABASE AUTH
            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: correoUsuario,

                    password: contrasenaUsuario,

                    options: {

                        emailRedirectTo: urlLogin,

                        data: {
                            nombre_completo: nombreUsuario
                        }

                    }

                });

            // Comprobar errores de Supabase
            if (error) {
                throw error;
            }

            // Comprobar respuesta
            if (!data || !data.user) {
                throw new Error(
                    "No se pudo completar la solicitud de registro."
                );
            }

            // Confirmación para el usuario
            if (data.session) {

                mensajeFormulario.textContent =
                    "Cuenta creada correctamente. " +
                    "Ya puedes utilizar tu cuenta.";

            } else {

                mensajeFormulario.textContent =
                    "Solicitud de registro recibida. " +
                    "Revisa tu correo electrónico para " +
                    "confirmar tu cuenta. Si ya tienes una, " +
                    "puedes intentar iniciar sesión.";

            }

            mensajeFormulario.className =
                "mensaje-formulario mensaje-exito";

            // Limpiar el formulario
            formulario.reset();

            // Limpiar validación anterior
            confirmarClave.setCustomValidity("");

            // Reiniciar el indicador visual
            if (typeof actualizarSeguridad === "function") {
                actualizarSeguridad();
            }

        } catch (error) {

            console.error(
                "Error en Supabase Auth:",
                error
            );

            mensajeFormulario.textContent =
                "No se pudo completar el registro: " +
                (error.message || "Intenta nuevamente.");

            mensajeFormulario.className =
                "mensaje-formulario mensaje-error";

        } finally {

            if (botonSubmit) {
                botonSubmit.disabled = false;
                botonSubmit.textContent = "Crear cuenta";
            }

        }

    });

});
