"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // SELECCIONAR LOS ELEMENTOS DEL FORMULARIO
    const formulario = document.querySelector(".registro form");
    const clave = document.querySelector("#clave");
    const confirmarClave = document.querySelector("#clave2");
    const aceptarTerminos = document.querySelector("#acepto-terminos");

    if (!formulario || !clave || !confirmarClave) return;

    // CREAR UN ESPACIO PARA LOS MENSAJES
    const mensajeFormulario = document.createElement("p");
    mensajeFormulario.className = "mensaje-formulario";
    mensajeFormulario.setAttribute("role", "status");
    mensajeFormulario.setAttribute("aria-live", "polite");
    formulario.appendChild(mensajeFormulario);

    // FUNCIÓN ROBUSTA PARA ENVOLVER EL INPUT Y AGREGAR EL BOTÓN DE VISIBILIDAD
    function agregarBotonVisibilidad(inputElement, nombreCampo) {
        // Evitamos duplicar si ya existe
        if (inputElement.parentElement.classList.contains("password-wrapper")) return;

        // 1. Creamos un contenedor envolvente para manejar el posicionamiento del icono
        const wrapper = document.createElement("div");
        wrapper.className = "password-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.display = "block";
        wrapper.style.width = "100%";

        // 2. Reemplazamos el input en el DOM colocando el wrapper en su lugar
        inputElement.parentNode.insertBefore(wrapper, inputElement);
        wrapper.appendChild(inputElement);

        // Ajustamos el padding del input para que el texto no choque con el icono
        inputElement.style.paddingRight = "40px";
        inputElement.style.boxSizing = "border-box";

        // 3. Creamos el botón del ícono del ojo
        const botonToggle = document.createElement("button");
        botonToggle.type = "button";
        botonToggle.className = "toggle-visibilidad";
        botonToggle.setAttribute("aria-label", `Mostrar u ocultar ${nombreCampo}`);
        
        // Estilos limpios inline para asegurar que no herede los estilos de los botones principales del formulario
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
        botonToggle.style.width = "auto";
        botonToggle.style.height = "auto";

        const icono = document.createElement("i");
        icono.className = "fa-solid fa-eye-slash"; // Ícono inicial de ojo cerrado
        
        botonToggle.appendChild(icono);
        wrapper.appendChild(botonToggle);

        // 4. Evento de clic para alternar tipo de input y cambiar el icono
        botonToggle.addEventListener("click", function () {
            const tipoActual = inputElement.getAttribute("type");
            const nuevoTipo = tipoActual === "password" ? "text" : "password";
            inputElement.setAttribute("type", nuevoTipo);

            // Alternamos las clases de FontAwesome
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

    // INYECTAR LOS BOTONES DE VISIBILIDAD EN AMBOS CAMPOS DE CONTRASEÑA
    agregarBotonVisibilidad(clave, "contraseña");
    agregarBotonVisibilidad(confirmarClave, "confirmación de contraseña");

    // INDICADOR DE SEGURIDAD DE LA CONTRASEÑA
    const indicador = document.createElement("div");
    indicador.className = "indicador-clave";
    indicador.setAttribute("aria-live", "polite");
    indicador.style.marginTop = "8px";

    const textoSeguridad = document.createElement("p");
    textoSeguridad.className = "texto-seguridad";
    textoSeguridad.style.fontSize = "0.8rem";
    textoSeguridad.style.color = "#666";

    const barraSeguridad = document.createElement("div");
    barraSeguridad.className = "barra-seguridad";
    barraSeguridad.style.height = "4px";
    barraSeguridad.style.width = "100%";
    barraSeguridad.style.background = "#e5e5e5";
    barraSeguridad.style.borderRadius = "2px";
    barraSeguridad.style.marginTop = "4px";

    const progresoSeguridad = document.createElement("div");
    progresoSeguridad.className = "progreso-seguridad";
    progresoSeguridad.style.height = "100%";
    progresoSeguridad.style.width = "0%";
    progresoSeguridad.style.borderRadius = "2px";
    progresoSeguridad.style.transition = "width 0.3s ease, background-color 0.3s ease";

    barraSeguridad.appendChild(progresoSeguridad);
    indicador.append(barraSeguridad, textoSeguridad);

    // Insertamos el indicador de seguridad debajo del wrapper de la clave principal
    clave.parentElement.parentElement.appendChild(indicador);

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
