"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // SELECCIONAR LOS ELEMENTOS DEL FORMULARIO
    const formulario = document.querySelector(".registro form");
    const campoNombre = document.querySelector("#nombre");
    const campoCorreo = document.querySelector("#correo");
    const clave = document.querySelector("#clave");
    const confirmarClave = document.querySelector("#clave2");
    const aceptarTerminos = document.querySelector("#acepto-terminos");
    const botonEnviar = formulario ? formulario.querySelector('button[type="submit"]') : null;

    if (!formulario || !clave || !confirmarClave) return;

    // CREAR UN ESPACIO PARA LOS MENSAJES
    const mensajeFormulario = document.createElement("p");
    mensajeFormulario.className = "mensaje-formulario";
    mensajeFormulario.setAttribute("role", "status");
    mensajeFormulario.setAttribute("aria-live", "polite");
    formulario.appendChild(mensajeFormulario);

    // FUNCIÓN PARA AGREGAR EL BOTÓN DE VISIBILIDAD DE CONTRASEÑA
    function agregarBotonVisibilidad(inputElement, nombreCampo) {
        // Creamos un contenedor o botón para alternar la visibilidad si no existe ya
        const wrapper = inputElement.parentElement;
        
        // Verificamos si ya existe un botón de toggle para evitar duplicados
        if (wrapper.querySelector('.toggle-visibilidad')) return;

        const botonToggle = document.createElement("button");
        botonToggle.type = "button";
        botonToggle.className = "toggle-visibilidad";
        botonToggle.setAttribute("aria-label", `Mostrar u ocultar ${nombreCampo}`);
        
        // Usamos clases de FontAwesome por defecto (fa-eye-slash para oculto)
        const icono = document.createElement("i");
        icono.className = "fas fa-eye-slash";
        // Asignamos un ID o clase si se quiere empalmar con la lógica que trajiste
        icono.id = inputElement === clave ? "iconToggle" : `iconToggle-${inputElement.id}`;
        
        botonToggle.appendChild(icono);
        wrapper.style.position = "relative";
        wrapper.appendChild(botonToggle);

        botonToggle.addEventListener("click", function () {
            const tipoActual = inputElement.getAttribute("type");
            const nuevoTipo = tipoActual === "password" ? "text" : "password";
            inputElement.setAttribute("type", nuevoTipo);

            // Cambiamos las clases del ícono (abierto / cerrado)
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

    // Validar mientras el usuario escribe
    clave.addEventListener("input", validarContrasenas);
    confirmarClave.addEventListener("input", validarContrasenas);

    // MOSTRAR U OCULTAR LAS CONTRASEÑAS
    agregarBotonVisibilidad(clave, "contraseña");
    agregarBotonVisibilidad(confirmarClave, "confirmación de contraseña");

    // INDICADOR DE SEGURIDAD DE LA CONTRASEÑA
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

    clave.parentElement.appendChild(indicador);

    function evaluarContrasena(valor) {
        let puntos = 0;

        if (valor.length >= 8) puntos++;
        if (valor.length >= 12) puntos++;
        if (/[a-z]/.test(valor) && /[A-Z]/.test(valor)) puntos++;
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

        textoSeguridad.textContent = `Seguridad estimada: ${nivel}`;
        progresoSeguridad.style.width = `${porcentaje}%`;

        if (porcentaje <= 35) {
            progresoSeguridad.style.backgroundColor = "#ef4444";
        } else if (porcentaje <= 65) {
            progresoSeguridad.style.backgroundColor = "#f59e0b";
        } else {
            progresoSeguridad.style.backgroundColor = "#22c55e";
        }
    }

    clave.addEventListener("input", actualizarSeguridad);

    // EFECTOS VISUALES AL INTERACTUAR
    const campos = formulario.querySelectorAll("input");

    campos.forEach(function (campo) {
        campo.addEventListener("focus", function () {
            campo.classList.add("campo-activo");
        });

        campo.addEventListener("blur", function () {
            campo.classList.remove("campo-activo");
        });
    });

    // VALIDAR EL ENVÍO DEL FORMULARIO
    formulario.addEventListener("submit", function (evento) {
        validarContrasenas();

        if (!formulario.checkValidity()) {
            evento.preventDefault();
            formulario.reportValidity();
            return;
        }

        if (clave.value !== confirmarClave.value) {
            evento.preventDefault();
            confirmarClave.reportValidity();
            confirmarClave.focus();
            return;
        }

        if (!aceptarTerminos.checked) {
            evento.preventDefault();

            mensajeFormulario.textContent = "Debes aceptar los Términos y Condiciones.";
            mensajeFormulario.className = "mensaje-formulario mensaje-error";

            aceptarTerminos.focus();
            return;
        }

        evento.preventDefault();

        mensajeFormulario.textContent = "Validación correcta.";
        mensajeFormulario.className = "mensaje-formulario mensaje-exito";
    });
});
