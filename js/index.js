"use strict";

// ==========================================
// SUPABASE - SESIÓN DEL USUARIO
// ==========================================

const SUPABASE_URL =
    "https://ipxswlfragitdknatffc.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_UwSZ_MRdeUDhwyOVFd-ldQ_VIaHm8b1";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


document.addEventListener("DOMContentLoaded", async function () {

    const loginLink =
        document.getElementById("loginLink");

    const userButton =
        document.getElementById("userButton");

    const userDropdown =
        document.getElementById("userDropdown");

    const navUserName =
        document.getElementById("navUserName");

    const navUserEmail =
        document.getElementById("navUserEmail");

    const dropdownUserName =
        document.getElementById("dropdownUserName");

    const dropdownUserEmail =
        document.getElementById("dropdownUserEmail");

    const logoutButton =
        document.getElementById("logoutButton");


    // ==========================================
    // COMPROBAR SESIÓN
    // ==========================================

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if (error) {
        console.error(
            "Error al comprobar la sesión:",
            error
        );
        return;
    }


    // ==========================================
    // NO HAY SESIÓN
    // ==========================================

    if (!session) {

        if (loginLink) {
            loginLink.hidden = false;
        }

        if (userButton) {
            userButton.hidden = true;
        }

        return;
    }


    // ==========================================
    // HAY UNA SESIÓN
    // ==========================================

    const usuario = session.user;

    const nombre =
        usuario.user_metadata?.nombre_completo ||
        usuario.email?.split("@")[0] ||
        "Usuario";

    const correo =
        usuario.email || "";


    // Mostrar datos en el menú
    if (navUserName) {
        navUserName.textContent = nombre;
    }

    if (navUserEmail) {
        navUserEmail.textContent = correo;
    }

    if (dropdownUserName) {
        dropdownUserName.textContent = nombre;
    }

    if (dropdownUserEmail) {
        dropdownUserEmail.textContent = correo;
    }


    // Ocultar Acceso
    if (loginLink) {
        loginLink.hidden = true;
    }

    // Mostrar usuario
    if (userButton) {
        userButton.hidden = false;
    }


    // ==========================================
    // ABRIR / CERRAR MENÚ
    // ==========================================

    if (userButton && userDropdown) {

        userButton.addEventListener("click", function (evento) {

            evento.stopPropagation();

            const abierto =
                !userDropdown.hidden;

            userDropdown.hidden = abierto;

            userButton.setAttribute(
                "aria-expanded",
                String(!abierto)
            );

        });


        document.addEventListener("click", function (evento) {

            if (
                !userDropdown.hidden &&
                !userDropdown.contains(evento.target) &&
                !userButton.contains(evento.target)
            ) {

                userDropdown.hidden = true;

                userButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });

    }


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    if (logoutButton) {

        logoutButton.addEventListener("click", async function () {

            logoutButton.disabled = true;
            logoutButton.textContent = "Cerrando sesión...";

            const { error } =
                await supabaseClient.auth.signOut();

            if (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

                logoutButton.disabled = false;
                logoutButton.textContent = "Cerrar sesión";

                return;
            }

            window.location.replace("index.html");

        });

    }

});

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

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('exitModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('exitContactForm');
  let hasShown = false;

  function openModal() {
    if (!hasShown && modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      hasShown = true; // Se muestra solo una vez por sesión
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // 1. Detección por movimiento hacia la zona superior (Pestañas / X del navegador)
  document.addEventListener('mousemove', function (e) {
    // Si el cursor está en los primeros 15 píxeles superiores de la ventana
    if (e.clientY <= 15) {
      openModal();
    }
  });

  // 2. Detección si el cursor sale completamente por la parte superior de la ventana
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 10) {
      openModal();
    }
  });

  // Cerrar al hacer clic en la X del modal
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Cerrar al hacer clic en el fondo oscuro
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Procesar envío del formulario
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('¡Gracias por contactarnos! Te responderemos pronto.');
      closeModal();
      form.reset();
    });
}
}); 
}); 
