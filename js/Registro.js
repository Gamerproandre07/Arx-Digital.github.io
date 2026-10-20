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

    // VALIDAR Y ENVIAR EL FORMULARIO A SUPABASE
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        validarContrasenas();

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        if (clave.value !== confirmarClave.value) {
            confirmarClave.reportValidity();
            confirmarClave.focus();
            return;
        }

        if (aceptarTerminos && !aceptarTerminos.checked) {
            mensajeFormulario.textContent = "Debes aceptar los Términos y Condiciones.";
            mensajeFormulario.className = "mensaje-formulario mensaje-error";
            aceptarTerminos.focus();
            return;
        }

        const botonSubmit = formulario.querySelector("button[type='submit']");
        if (botonSubmit) botonSubmit.disabled = true;

        mensajeFormulario.textContent = "Registrando usuario...";
        mensajeFormulario.className = "mensaje-formulario";

        try {
            // Inserción directa en tu tabla 'Registro'[cite: 1]
            const { error } = await supabaseClient
                .from("Registro")
                .insert([
                    {
                        Nombre_completo: nombre.value.trim(),
                        Correo_electronico: correo.value.trim(),
                        Contraseña: clave.value
                    }
                ]);

            if (error) {
                throw error;
            }

            mensajeFormulario.textContent = "¡Registro exitoso! Datos guardados en Supabase.";
            mensajeFormulario.className = "mensaje-formulario mensaje-exito";

            formulario.reset();
            confirmarClave.setCustomValidity("");

        } catch (error) {
            console.error("Error al registrar en Supabase:", error.message);
            mensajeFormulario.textContent = `Error al registrar: ${error.message}`;
            mensajeFormulario.className = "mensaje-formulario mensaje-error";
        } finally {
            if (botonSubmit) botonSubmit.disabled = false;
        }
    });
});
