document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ELEMENTOS DEL DOM
    // ==========================================
    const inputBuscar = document.getElementById("buscar");
    const botonesFiltro = document.querySelectorAll(".filters button");
    const tarjetasRecursos = document.querySelectorAll("#recursos .resource");
    const mensajeSinResultados = document.getElementById("sin-resultados");
    const guias = document.querySelectorAll(".guide");

    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let filtroActual = "todos";
    let textoBusqueda = "";
    let temporizadorBusqueda;

    // ==========================================
    // 2. NORMALIZAR TEXTO
    // ==========================================
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // ==========================================
    // 3. ANIMACIÓN INICIAL
    // ==========================================
    function animarEntradaInicial() {
        if (reducirMovimiento) return;

        const elementos = document.querySelectorAll(
            ".hero, .resource-tools, #recursos .resource, main > section"
        );

        elementos.forEach((elemento, indice) => {
            elemento.classList.add("arx-aparecer");
            elemento.style.animationDelay =
                `${Math.min(indice * 0.08, 0.4)}s`;
        });
    }

    // ==========================================
    // 4. BÚSQUEDA Y FILTRADO
    // ==========================================
    function filtrarRecursos() {
        let contadorVisibles = 0;

        tarjetasRecursos.forEach((tarjeta, indice) => {
            const tipo = tarjeta.dataset.kind;
            const contenido = normalizarTexto(tarjeta.textContent);

            const coincideFiltro =
                filtroActual === "todos" || tipo === filtroActual;

            const coincideTexto = contenido.includes(textoBusqueda);
            const mostrar = coincideFiltro && coincideTexto;

            tarjeta.hidden = !mostrar;

            if (mostrar) {
                contadorVisibles++;

                // Activar la animación definida en el CSS
                tarjeta.classList.remove("arx-entrada");

                if (!reducirMovimiento) {
                    // Reiniciar la animación al filtrar
                    void tarjeta.offsetWidth;

                    tarjeta.style.animationDelay =
                        `${Math.min(indice * 0.09, 0.36)}s`;

                    tarjeta.classList.add("arx-entrada");
                } else {
                    tarjeta.style.animationDelay = "";
                }
            } else {
                tarjeta.classList.remove("arx-entrada");
                tarjeta.style.animationDelay = "";
            }
        });

        // Mensaje de búsqueda sin coincidencias
        if (mensajeSinResultados) {
            mensajeSinResultados.hidden = contadorVisibles > 0;
        }
    }

    // ==========================================
    // 5. EVENTO DE BÚSQUEDA
    // ==========================================
    if (inputBuscar) {
        inputBuscar.addEventListener("input", evento => {
            textoBusqueda = normalizarTexto(
                evento.target.value.trim()
            );

            clearTimeout(temporizadorBusqueda);

            temporizadorBusqueda = setTimeout(() => {
                filtrarRecursos();
            }, 100);
        });
    }

    // ==========================================
    // 6. BOTONES DE FILTRO
    // ==========================================
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            filtroActual = boton.dataset.filter || "todos";

            botonesFiltro.forEach(otroBoton => {
                const seleccionado = otroBoton === boton;

                otroBoton.classList.toggle("active", seleccionado);
                otroBoton.setAttribute(
                    "aria-pressed",
                    String(seleccionado)
                );
            });

            filtrarRecursos();
        });
    });

    // ==========================================
    // 7. ACORDEÓN DE GUÍAS
    // ==========================================
    guias.forEach(guia => {
        guia.addEventListener("toggle", () => {
            if (!guia.open) return;

            guias.forEach(otraGuia => {
                if (otraGuia !== guia) {
                    otraGuia.open = false;
                }
            });
        });
    });

    // ==========================================
    // 8. ABRIR GUÍAS MEDIANTE ENLACES DIRECTOS
    // ==========================================
    function abrirGuiaDesdeHash() {
        const idGuia = decodeURIComponent(
            window.location.hash.slice(1)
        );

        if (!idGuia) return;

        const guia = document.getElementById(idGuia);

        if (!guia || !guia.classList.contains("guide")) return;

        guia.open = true;

        guia.scrollIntoView({
            behavior: reducirMovimiento ? "auto" : "smooth",
            block: "start"
        });
    }

    window.addEventListener("hashchange", abrirGuiaDesdeHash);

    // ==========================================
    // 9. INICIALIZACIÓN
    // ==========================================
    animarEntradaInicial();
    filtrarRecursos();
    abrirGuiaDesdeHash();
});
