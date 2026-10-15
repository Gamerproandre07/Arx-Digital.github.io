document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ELEMENTOS PRINCIPALES
    // ==========================================
    const encabezado = document.querySelector(".site-header");
    const navegacion = document.querySelector("nav");
    const enlacesNavegacion = document.querySelectorAll("nav a");
    const enlacesInternos = document.querySelectorAll('a[href*="#"]');
    const secciones = document.querySelectorAll("main section");
    const tarjetas = document.querySelectorAll(".card");
    const botones = document.querySelectorAll(".button");
    const enlacesPie = document.querySelectorAll(".site-footer a");
    const elementosAnimados = document.querySelectorAll(
        ".about-intro, .mission, #enfoque, #equipo, .card, .site-footer"
    );

    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // ==========================================
    // 2. NORMALIZAR TEXTO
    // ==========================================
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    // ==========================================
    // 3. ANIMACIÓN INICIAL DE LOS ELEMENTOS
    // ==========================================
    function animarEntrada() {
        if (reducirMovimiento) return;

        elementosAnimados.forEach((elemento, indice) => {
            elemento.dataset.animacionPreparada = "true";

            elemento.style.animationDelay =
                `${Math.min(indice * 0.07, 0.35)}s`;
        });
    }

    // ==========================================
    // 4. NAVEGACIÓN PRINCIPAL
    // ==========================================
    function actualizarEnlaceActivo() {
        const paginaActual = normalizarTexto(
            window.location.pathname.split("/").pop() || "index.html"
        );

        enlacesNavegacion.forEach(enlace => {
            const destino = enlace.getAttribute("href");

            if (!destino || destino.startsWith("#")) return;

            const paginaDestino = normalizarTexto(
                destino.split("/").pop().split("#")[0]
            );

            if (paginaDestino === paginaActual) {
                enlace.setAttribute("aria-current", "page");
            } else if (enlace.getAttribute("aria-current") === "page") {
                enlace.removeAttribute("aria-current");
            }
        });
    }

    // ==========================================
    // 5. DESPLAZAMIENTO A SECCIONES INTERNAS
    // ==========================================
    function desplazarseASeccion(enlace) {
        const destino = enlace.getAttribute("href");

        if (!destino || !destino.includes("#")) return;

        const indiceHash = destino.indexOf("#");
        const idDestino = decodeURIComponent(
            destino.slice(indiceHash + 1)
        );

        if (!idDestino) return;

        const urlDestino = new URL(destino, window.location.href);

        // Solo gestionar enlaces que apuntan a esta misma página.
        if (urlDestino.pathname !== window.location.pathname) return;

        const elementoDestino = document.getElementById(idDestino);

        if (!elementoDestino) return;

        elementoDestino.scrollIntoView({
            behavior: reducirMovimiento ? "auto" : "smooth",
            block: "start"
        });
    }

    enlacesInternos.forEach(enlace => {
        enlace.addEventListener("click", evento => {
            const destino = enlace.getAttribute("href");

            if (!destino || !destino.includes("#")) return;

            const urlDestino = new URL(destino, window.location.href);

            if (urlDestino.pathname !== window.location.pathname) return;

            const idDestino = decodeURIComponent(
                urlDestino.hash.slice(1)
            );

            const elementoDestino = document.getElementById(idDestino);

            if (!elementoDestino) return;

            evento.preventDefault();

            // Actualizar el fragmento de la URL sin recargar la página.
            if (window.location.hash !== urlDestino.hash) {
                history.pushState(null, "", urlDestino.hash);
            }

            desplazarseASeccion(enlace);
        });
    });

    // ==========================================
    // 6. ABRIR SECCIONES DESDE LA URL
    // ==========================================
    function abrirSeccionDesdeHash() {
        if (!window.location.hash) return;

        let idDestino;

        try {
            idDestino = decodeURIComponent(
                window.location.hash.slice(1)
            );
        } catch {
            return;
        }

        const elementoDestino = document.getElementById(idDestino);

        if (!elementoDestino) return;

        requestAnimationFrame(() => {
            elementoDestino.scrollIntoView({
                behavior: reducirMovimiento ? "auto" : "smooth",
                block: "start"
            });
        });
    }

    window.addEventListener("hashchange", abrirSeccionDesdeHash);

    window.addEventListener("popstate", () => {
        if (window.location.hash) {
            abrirSeccionDesdeHash();
        }
    });

    // ==========================================
    // 7. INTERACCIÓN CON LAS TARJETAS
    // ==========================================
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("mouseenter", () => {
            tarjeta.dataset.interactiva = "true";
        });

        tarjeta.addEventListener("mouseleave", () => {
            delete tarjeta.dataset.interactiva;
        });

        tarjeta.addEventListener("focusin", () => {
            tarjeta.dataset.interactiva = "true";
        });

        tarjeta.addEventListener("focusout", evento => {
            if (!tarjeta.contains(evento.relatedTarget)) {
                delete tarjeta.dataset.interactiva;
            }
        });
    });

    // ==========================================
    // 8. INTERACCIÓN CON LOS BOTONES
    // ==========================================
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            // Evitar modificar enlaces que funcionan como navegación.
            if (boton.tagName === "A") {
                boton.dataset.activado = "true";

                window.setTimeout(() => {
                    delete boton.dataset.activado;
                }, 250);
            }
        });
    });

    // ==========================================
    // 9. IDENTIFICAR LA SECCIÓN VISIBLE
    // ==========================================
    if ("IntersectionObserver" in window) {
        const observadorSecciones = new IntersectionObserver(
            entradas => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        entrada.target.dataset.visible = "true";
                    } else {
                        delete entrada.target.dataset.visible;
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        secciones.forEach(seccion => {
            observadorSecciones.observe(seccion);
        });
    }

    // ==========================================
    // 10. CONTROL DEL PIE DE PÁGINA
    // ==========================================
    enlacesPie.forEach(enlace => {
        enlace.addEventListener("focus", () => {
            enlace.dataset.enfocado = "true";
        });

        enlace.addEventListener("blur", () => {
            delete enlace.dataset.enfocado;
        });
    });

    // ==========================================
    // 11. COMPROBAR LA NAVEGACIÓN
    // ==========================================
    function comprobarNavegacion() {
        if (!navegacion || !encabezado) return;

        const enlaces = navegacion.querySelectorAll("a");

        enlaces.forEach(enlace => {
            const destino = enlace.getAttribute("href");

            if (!destino) {
                enlace.removeAttribute("aria-disabled");
                return;
            }

            // Mantener disponibles los enlaces de navegación.
            enlace.removeAttribute("aria-disabled");
        });
    }

    // ==========================================
    // 12. INICIALIZACIÓN
    // ==========================================
    animarEntrada();
    actualizarEnlaceActivo();
    comprobarNavegacion();

    // Abrir el destino indicado en la URL al cargar.
    abrirSeccionDesdeHash();
});
