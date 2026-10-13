"use strict";


// SELECCIONAR LOS ELEMENTOS DEL FORMULARIO


const formulario = document.querySelector(".registro form");
const campoNombre = document.querySelector("#nombre");
const campoCorreo = document.querySelector("#correo");
const clave = document.querySelector("#clave");
const confirmarClave = document.querySelector("#clave2");
const aceptarTerminos = document.querySelector("#acepto-terminos");
const botonEnviar = formulario.querySelector('button[type="submit"]');


// CREAR UN ESPACIO PARA LOS MENSAJES


const mensajeFormulario = document.createElement("p");

mensajeFormulario.className = "mensaje-formulario";
mensajeFormulario.setAttribute("role", "status");
mensajeFormulario.setAttribute("aria-live", "polite");

formulario.appendChild(mensajeFormulario);


// VALIDAR Y COMPARAR LAS CONTRASEÑAS


function validarContrasenas() {
    const contrasena = clave.value;
    const confirmacion = confirmarClave.value;

    if (confirmacion === "") {
        confirmarClave.setCustomValidity("");
        return;
    }

    if (contrasena !== confirmacion) {
        confirmarClave.setCustomValidity(
            "Las contraseñas no coinciden."
        );
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

        mensajeFormulario.textContent =
            "Debes aceptar los Términos y Condiciones.";

        mensajeFormulario.className =
            "mensaje-formulario mensaje-error";

        aceptarTerminos.focus();
        return;
    }

    // Todavía no existe un servidor que cree la cuenta.
    // Evitamos simular un registro exitoso.

    evento.preventDefault();

    mensajeFormulario.textContent =
        "Validación correcta.";

    mensajeFormulario.className =
        "mensaje-formulario mensaje-exito";
});
