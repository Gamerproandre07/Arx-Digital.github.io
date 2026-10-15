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
    // 3. AÑADIR ESTILOS DE ANIMACIÓN
    // ==========================================
    const estilosAnimacion = document.createElement("style");

    estilosAnimacion.textContent = `
        /* Aparición inicial */
        @keyframes arxEntrada {
            from {
                opacity: 0;
                transform: translateY(22px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Aparición de tarjetas filtradas */
        @keyframes arxTarjetaEntrada {
            from {
                opacity: 0;
                transform: translateY(16px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        /* Aparición del mensaje */
        @keyframes arxMensaje {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Entrada de contenido desplegable */
        @keyframes arxContenido {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Tarjetas */
        #recursos .resource {
            transition:
                transform 0.28s ease,
                box-shadow 0.28s ease,
                border-color 0.28s ease,
                opacity 0.22s ease;
            will-change: transform;
        }

        #recursos .resource:hover {
            transform: translateY(-7px);
            box-shadow: 0 14px 30px rgba(7, 53, 104, 0.12);
            border-color: #8acbd5;
        }

        #recursos .resource .visual svg {
            transition: transform 0.3s ease;
        }

        #recursos .resource:hover .visual svg {
            transform: scale(1.1);
        }

        /* Botones de filtros */
        .filters button {
            transition:
                background-color 0.22s ease,
                color 0.22s ease,
                border-color 0.22s ease,
                transform 0.18s ease,
                box-shadow 0.22s ease;
        }

        .filters button:hover {
            transform: translateY(-2px);
            border-color: #007c99;
            box-shadow: 0 4px 10px rgba(0, 124, 153, 0.12);
        }

        .filters button:active {
            transform: scale(0.96);
        }

        .filters button.active {
            box-shadow: 0 3px 8px rgba(7, 53, 104, 0.15);
        }

        /* Campo de búsqueda */
        .resource-tools input {
            transition:
                border-color 0.25s ease,
                box-shadow 0.25s ease,
                background-color 0.25s ease;
        }

        .resource-tools input:focus {
            border-color: #007c99;
            box-shadow: 0 0 0 4px rgba(0, 124, 153, 0.12);
            outline-offset: 2px;
        }

        /* Enlaces de los recursos */
        #recursos .text-link {
            transition:
                background-color 0.22s ease,
                color 0.22s ease,
                border-color 0.22s ease,
                transform 0.22s ease;
        }

        #recursos .text-link:hover {
            background-color: #006bb3;
            color: #fff;
            border-color: #006bb3;
            text-decoration: none;
            transform: translateY(-2px);
        }

        /* Ventanas desplegables */
        main details {
            transition:
                border-color 0.25s ease,
                box-shadow 0.25s ease;
        }

        main details:hover {
            border-color: #8acbd5;
        }

        main details[open] {
            box-shadow: 0 7px 20px rgba(7, 53, 104, 0.07);
        }

        main details summary {
            transition:
                background-color 0.25s ease,
                color 0.25s ease;
        }

        main details summary:hover {
            color: #007c99;
        }

        main details[open] > p,
        main details[open] > ol {
            animation: arxContenido 0.3s ease both;
        }

        /* Mensaje de búsqueda */
        #sin-resultados:not([hidden]) {
            animation: arxMensaje 0.3s ease both;
            padding: 16px;
            border: 1px solid #d6e6ee;
            border-radius: 8px;
            background: #edf8fa;
            text-align: center;
        }

        /* Aparición escalonada de las tarjetas */
        #recursos .resource.arx-entrada {
            animation: arxTarjetaEntrada 0.4s ease both;
        }

        /* Aparición inicial de secciones */
        .arx-aparecer {
            animation: arxEntrada 0.65s ease both;
        }

        /* Compatibilidad con usuarios que reducen movimiento */
        @media (prefers-reduced-motion: reduce) {
            #recursos .resource,
            #recursos .resource .visual svg,
            .filters button,
            .resource-tools input,
            #recursos .text-link,
            main details,
            main details summary {
                transition: none !important;
            }

            .arx-aparecer,
            #recursos .resource.arx-entrada,
            #sin-resultados:not([hidden]),
            main details[open] > p,
            main details[open] > ol {
                animation: none !important;
            }

            #recursos .resource:hover,
            #recursos .resource:hover .visual svg,
            .filters button:hover,
            .filters button:active,
            #recursos .text-link:hover {
                transform: none !important;
            }
        }
    `;

    document.head.appendChild(estilosAnimacion);

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
