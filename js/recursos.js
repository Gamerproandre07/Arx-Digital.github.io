document.addEventListener("DOMContentLoaded", () => {
    // Elementos principales
    const inputBuscar = document.getElementById("buscar");
    const botonesFiltro = document.querySelectorAll(".filters button");
    const tarjetasRecursos = document.querySelectorAll("#recursos .resource");
    const mensajeSinResultados = document.getElementById("sin-resultados");
    const guias = document.querySelectorAll(".guide");

    let filtroActual = "todos";
    let textoBusqueda = "";

    // Normalizar texto para ignorar mayúsculas y tildes
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Buscar y filtrar recursos
    function filtrarRecursos() {
        let contadorVisibles = 0;

        tarjetasRecursos.forEach(tarjeta => {
            const tipo = tarjeta.getAttribute("data-kind");
            const contenido = normalizarTexto(tarjeta.textContent);

            const coincideFiltro =
                filtroActual === "todos" || tipo === filtroActual;

            const coincideTexto =
                contenido.includes(textoBusqueda);

            const mostrar = coincideFiltro && coincideTexto;

            // Usar hidden para respetar los estilos CSS existentes
            tarjeta.hidden = !mostrar;

            if (mostrar) {
                contadorVisibles++;
            }
        });

        // Mostrar mensaje cuando no hay coincidencias
        if (mensajeSinResultados) {
            mensajeSinResultados.hidden = contadorVisibles > 0;
        }
    }

    // Evento de búsqueda en tiempo real
    if (inputBuscar) {
        inputBuscar.addEventListener("input", (evento) => {
            textoBusqueda = normalizarTexto(
                evento.target.value.trim()
            );

            filtrarRecursos();
        });
    }

    // Botones de filtros: Todos, Guías y Checklists
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach(otroBoton => {
                otroBoton.classList.remove("active");
                otroBoton.setAttribute("aria-pressed", "false");
            });

            boton.classList.add("active");
            boton.setAttribute("aria-pressed", "true");

            filtroActual = boton.getAttribute("data-filter");

            filtrarRecursos();
        });
    });

    // Acordeón: cerrar las otras guías al abrir una
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

    // Abrir una guía directamente mediante su identificador
    function abrirGuiaDesdeHash() {
        const idGuia = window.location.hash.slice(1);

        if (!idGuia) return;

        const guia = document.getElementById(idGuia);

        if (guia && guia.classList.contains("guide")) {
            guia.open = true;

            // Desplazarse hasta la guía
            guia.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        }
    }

    // Detectar enlaces directos y cambios de hash
    window.addEventListener("hashchange", abrirGuiaDesdeHash);

    abrirGuiaDesdeHash();

    // Inicializar los recursos al cargar la página
    filtrarRecursos();
});

// Animaciones y estilos de JS.
