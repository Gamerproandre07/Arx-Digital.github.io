document.addEventListener("DOMContentLoaded", () => {
    const inputBuscar = document.getElementById("buscar");
    const botonesFiltro = document.querySelectorAll(".filters button");
    const tarjetasRecursos = document.querySelectorAll("#recursos .resource");
    const mensajeSinResultados = document.getElementById("sin-resultados");

    let filtroActual = "todos";
    let textoBusqueda = "";

    // Función principal para filtrar las tarjetas en pantalla
    function filtrarRecursos() {
        let contadorVisibles = 0;

        tarjetasRecursos.forEach(tarjeta => {
            const tipo = tarjeta.getAttribute("data-kind");
            const titulo = tarjeta.querySelector("h3").textContent.toLowerCase();
            const coincideFiltro = (filtroActual === "todos" || tipo === filtroActual);
            const coincideTexto = titulo.includes(textoBusqueda);

            if (coincideFiltro && coincideTexto) {
                tarjeta.style.display = "";
                contadorVisibles++;
            } else {
                tarjeta.style.display = "none";
            }
        });

        // Mostrar u ocultar mensaje de "sin resultados"
        if (contadorVisibles === 0) {
            mensajeSinResultados.hidden = false;
        } else {
            mensajeSinResultados.hidden = true;
        }
    }

    // 1. Evento para la barra de búsqueda en tiempo real
    if (inputBuscar) {
        inputBuscar.addEventListener("input", (e) => {
            textoBusqueda = e.target.value.trim().toLowerCase();
            filtrarRecursos();
        });
    }

    // 2. Evento para los botones de filtros (Todos, Guías, Checklists)
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            // Cambiar clase activa y atributo aria-pressed
            botonesFiltro.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-pressed", "false");
            });

            boton.classList.add("active");
            boton.setAttribute("aria-pressed", "true");

            // Obtener el tipo de filtro seleccionado
            filtroActual = boton.getAttribute("data-filter");
            filtrarRecursos();
        });
    });
});