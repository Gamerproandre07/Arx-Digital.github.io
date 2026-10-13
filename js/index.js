"use strict";


// ARX DIGITAL - INTERACCIONES Y ANIMACIONES


document.addEventListener("DOMContentLoaded", function () {

    // Comprobar si el usuario prefiere menos movimiento.
    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;



    // ANIMACIONES AL DESPLAZARSE POR LA PÁGINA


    const elementosAnimados = document.querySelectorAll(
        ".hero-art, .audiences .card, .news, " +
        ".cases .card, .risks .card, .cta"
    );

    if (!reducirMovimiento && "IntersectionObserver" in window) {

        const observador = new IntersectionObserver(
            function (entradas, observadorActual) {

                entradas.forEach(function (entrada) {

                    if (entrada.isIntersecting) {

                        const elemento = entrada.target;

                        elemento.animate(
                            [
                                {
                                    opacity: 0,
                                    transform: "translateY(22px)"
                                },
                                {
                                    opacity: 1,
                                    transform: "translateY(0)"
                                }
                            ],
                            {
                                duration: 650,
                                easing: "ease-out",
                                fill: "both"
                            }
                        );

                        // No repetir la animación al volver a subir.
                        observadorActual.unobserve(elemento);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        elementosAnimados.forEach(function (elemento) {
            observador.observe(elemento);
        });

    }



    // EFECTO DE ONDA EN LOS BOTONES


    const botones = document.querySelectorAll(".button");

    botones.forEach(function (boton) {

        boton.addEventListener("click", function (evento) {

            if (reducirMovimiento) {
                return;
            }

            // Preparar el botón para contener la onda.
            if (getComputedStyle(boton).position === "static") {
                boton.style.position = "relative";
            }

            boton.style.overflow = "hidden";

            // Eliminar una onda anterior si todavía existe.
            const ondaAnterior = boton.querySelector(".button-ripple");

            if (ondaAnterior) {
                ondaAnterior.remove();
            }

            const onda = document.createElement("span");

            onda.className = "button-ripple";

            // Calcular dónde pulsó el usuario.
            const rectangulo = boton.getBoundingClientRect();

            const x = evento.clientX
                ? evento.clientX - rectangulo.left
                : rectangulo.width / 2;

            const y = evento.clientY
                ? evento.clientY - rectangulo.top
                : rectangulo.height / 2;

            const tamano = Math.max(
                boton.clientWidth,
                boton.clientHeight
            ) * 2;

            // Definir la apariencia de la onda.
            Object.assign(onda.style, {
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: `${tamano}px`,
                height: `${tamano}px`,
                borderRadius: "50%",
                background: "rgba(127, 127, 127, 0.25)",
                pointerEvents: "none",
                transform: "translate(-50%, -50%) scale(0)",
                opacity: "1",
                zIndex: "0"
            });

            boton.appendChild(onda);

            // Animar la onda con la API nativa del navegador.
            const animacion = onda.animate(
                [
                    {
                        transform: "translate(-50%, -50%) scale(0)",
                        opacity: 0.8
                    },
                    {
                        transform: "translate(-50%, -50%) scale(1)",
                        opacity: 0
                    }
                ],
                {
                    duration: 550,
                    easing: "ease-out",
                    fill: "forwards"
                }
            );

            animacion.onfinish = function () {
                onda.remove();
            };

        });

    });



    // MOVIMIENTO SUTIL DEL ESCUDO PRINCIPAL


    const ilustracion = document.querySelector(".hero-art");

    if (ilustracion && !reducirMovimiento) {

        ilustracion.addEventListener("pointermove", function (evento) {

            // Aplicar este efecto únicamente con ratón o trackpad.
            if (evento.pointerType !== "mouse") {
                return;
            }

            const rectangulo = ilustracion.getBoundingClientRect();

            const posicionX =
                (evento.clientX - rectangulo.left) /
                rectangulo.width;

            const posicionY =
                (evento.clientY - rectangulo.top) /
                rectangulo.height;

            const movimientoX = (posicionX - 0.5) * 5;
            const movimientoY = (posicionY - 0.5) * 5;

            ilustracion.style.transform =
                `perspective(900px) rotateX(${-movimientoY}deg) ` +
                `rotateY(${movimientoX}deg)`;

        });

        // Recuperar la posición original al salir.
        ilustracion.addEventListener("pointerleave", function () {

            ilustracion.style.transform = "";

        });

    }



    // SOMBRAS INTERACTIVAS EN LAS TARJETAS


    const tarjetas = document.querySelectorAll(
        ".cases .card, .risks .card, .news"
    );

    tarjetas.forEach(function (tarjeta) {

        tarjeta.addEventListener("pointerenter", function (evento) {

            if (reducirMovimiento || evento.pointerType === "touch") {
                return;
            }

            tarjeta.style.transition =
                "box-shadow 250ms ease, transform 250ms ease";

            tarjeta.style.boxShadow =
                "0 12px 28px rgba(0, 0, 0, 0.09)";

            tarjeta.style.transform = "translateY(-3px)";

        });

        tarjeta.addEventListener("pointerleave", function () {

            tarjeta.style.boxShadow = "";
            tarjeta.style.transform = "";

        });

    });


    // EFECTO DE CONFIRMACIÓN PARA ENLACES


    const enlaces = document.querySelectorAll(
        ".hero-link, .card-link, .site-header nav a"
    );

    enlaces.forEach(function (enlace) {

        enlace.addEventListener("focus", function () {
            enlace.style.textUnderlineOffset = "6px";
        });

        enlace.addEventListener("blur", function () {
            enlace.style.textUnderlineOffset = "";
        });

    });

});
