document.addEventListener("DOMContentLoaded", () => {
    const inputBuscar = document.getElementById("buscar");
    const botonesFiltro = document.querySelectorAll(".filters button");
    const tarjetasRecursos = document.querySelectorAll("#recursos .resource");
    const mensajeSinResultados = document.getElementById("sin-resultados");

    let filtroActual = "todos";
    let textoBusqueda = "";

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

        if (contadorVisibles === 0) {
            mensajeSinResultados.hidden = false;
        } else {
            mensajeSinResultados.hidden = true;
        }
    }

    if (inputBuscar) {
        inputBuscar.addEventListener("input", (e) => {
            textoBusqueda = e.target.value.trim().toLowerCase();
            filtrarRecursos();
        });
    }

    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-pressed", "false");
            });

            boton.classList.add("active");
            boton.setAttribute("aria-pressed", "true");

            filtroActual = boton.getAttribute("data-filter");
            filtrarRecursos();
        });
    });
});
