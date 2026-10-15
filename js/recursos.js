document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ELEMENTOS PRINCIPALES
    // ==========================================
    const inputBuscar = document.getElementById("buscar");
    const botonesFiltro = document.querySelectorAll(".filters button");
    const tarjetasRecursos = document.querySelectorAll("#recursos .resource");
    const mensajeSinResultados = document.getElementById("sin-resultados");
    const guias = document.querySelectorAll(".guide");
    const elementosAnimados = document.querySelectorAll(
        ".hero, #recursos .resource, main > section, .resource-tools, .site-footer"
    );

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
// 3. ANIMACIÓN INICIAL DE SECCIONES
// ==========================================
if (!reducirMovimiento) {
    elementosAnimados.forEach((elemento, indice) => {
        elemento.classList.add("arx-aparecer");

        elemento.style.animationDelay =
            `${Math.min(indice * 0.08, 0.4)}s`;
    });
}

    // ==========================================
    // 4. ANIMACIÓN INICIAL DE SECCIONES
    // ==========================================
    if (!reducirMovimiento) {
        elementosAnimados.forEach((elemento, indice) => {
            elemento.classList.add("arx-aparecer");
            elemento.style.animationDelay = `${Math.min(indice * 0.08, 0.4)}s`;
        });
    }

    // ==========================================
    // 5. FILTRAR RECURSOS
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

            if (mostrar) {
                tarjeta.hidden = false;
                contadorVisibles++;

                // Animar la aparición de cada tarjeta
                if (!reducirMovimiento) {
                    tarjeta.classList.remove("arx-entrada");

                    // Reiniciar la animación al aplicar otro filtro
                    void tarjeta.offsetWidth;

                    tarjeta.style.animationDelay = `${Math.min(
                        indice * 0.09,
                        0.36
                    )}s`;

                    tarjeta.classList.add("arx-entrada");
                }
            } else {
                tarjeta.hidden = true;
                tarjeta.classList.remove("arx-entrada");
                tarjeta.style.animationDelay = "";
            }
        });

        if (mensajeSinResultados) {
            mensajeSinResultados.hidden = contadorVisibles > 0;
        }
    }

    // ==========================================
    // 6. BÚSQUEDA EN TIEMPO REAL
    // ==========================================
    if (inputBuscar) {
        inputBuscar.addEventListener("input", evento => {
            textoBusqueda = normalizarTexto(
                evento.target.value.trim()
            );

            clearTimeout(temporizadorBusqueda);

            // Pequeña pausa para evitar animaciones excesivas
            temporizadorBusqueda = setTimeout(() => {
                filtrarRecursos();
            }, 100);
        });
    }

    // ==========================================
    // 7. BOTONES DE FILTRO ANIMADOS
    // ==========================================
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach(otroBoton => {
                otroBoton.classList.remove("active");
                otroBoton.setAttribute("aria-pressed", "false");
            });

            boton.classList.add("active");
            boton.setAttribute("aria-pressed", "true");

            filtroActual = boton.dataset.filter;

            filtrarRecursos();
        });
    });

    // ==========================================
    // 8. ACORDEÓN DE GUÍAS
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
    // 9. ABRIR GUÍAS MEDIANTE SU URL
    // ==========================================
    function abrirGuiaDesdeHash() {
        const idGuia = window.location.hash.slice(1);

        if (!idGuia) return;

        const guia = document.getElementById(idGuia);

        if (guia && guia.classList.contains("guide")) {
            guia.open = true;

            guia.scrollIntoView({
                behavior: reducirMovimiento ? "auto" : "smooth",
                block: "start"
            });
        }
    }

    window.addEventListener("hashchange", abrirGuiaDesdeHash);

    // ==========================================
    // 10. INICIALIZACIÓN
    // ==========================================
    filtrarRecursos();
    abrirGuiaDesdeHash();
});
