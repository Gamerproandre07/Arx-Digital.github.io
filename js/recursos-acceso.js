
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURACIÓN DE SUPABASE - ARX DIGITAL
    // ==========================================

    const SUPABASE_URL =
        "https://ipxswlfragitdknatffc.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_UwSZ_MRdeUDhwyOVFd-ldQ_VIaHm8b1";

    // ==========================================
    // CREAR MODAL DE ACCESO
    // ==========================================

    const modal = document.createElement("div");
    modal.className = "arx-access-overlay";
    modal.hidden = true;

    modal.innerHTML = `
        <div class="arx-access-modal"
             role="dialog"
             aria-modal="true"
             aria-labelledby="arxAccessTitle"
             aria-describedby="arxAccessDescription"
             tabindex="-1">

            <button type="button"
                    class="arx-access-close"
                    aria-label="Cerrar ventana">
                &times;
            </button>

            <div class="arx-access-icon">
                &#128274;
            </div>

            <h2 id="arxAccessTitle">
                Contenido exclusivo
            </h2>

            <p id="arxAccessDescription">
                Para acceder a los recursos educativos
                de ARX DIGITAL, necesitas iniciar sesión
                en tu cuenta.
            </p>

            <a href="login.html"
               class="arx-access-login">
                Iniciar sesión &rarr;
            </a>

            <a href="Registro.html"
               class="arx-access-register">
                Crear una cuenta
            </a>

            <button type="button"
                    class="arx-access-cancel">
                Ahora no
            </button>

        </div>
    `;

    document.body.appendChild(modal);

    const ventana = modal.querySelector(".arx-access-modal");
    const botonCerrar = modal.querySelector(".arx-access-close");
    const botonCancelar = modal.querySelector(".arx-access-cancel");

    let elementoAnterior = null;

    function abrirModal() {
        elementoAnterior = document.activeElement;
        modal.hidden = false;
        document.body.classList.add("arx-modal-open");
        botonCerrar.focus();
    }

    function cerrarModal() {
        modal.hidden = true;
        document.body.classList.remove("arx-modal-open");

        if (elementoAnterior?.isConnected) {
            elementoAnterior.focus();
        }
    }

    botonCerrar.addEventListener("click", cerrarModal);
    botonCancelar.addEventListener("click", cerrarModal);

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (modal.hidden) return;

        if (evento.key === "Escape") {
            cerrarModal();
        }

        if (evento.key === "Tab") {
            const elementos = [...modal.querySelectorAll(
                'button, a[href]'
            )].filter(elemento => !elemento.disabled);

            const primero = elementos[0];
            const ultimo = elementos[elementos.length - 1];

            if (evento.shiftKey &&
                document.activeElement === primero) {
                evento.preventDefault();
                ultimo.focus();
            } else if (!evento.shiftKey &&
                document.activeElement === ultimo) {
                evento.preventDefault();
                primero.focus();
            }
        }
    });

    // ==========================================
    // CONTROL DE ACCESO A RECURSOS
    // ==========================================

    let cliente = null;

    if (window.supabase) {
        cliente = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
    } else {
        console.error("No se pudo cargar Supabase.");
    }

    const enlaces = document.querySelectorAll(
        "#recursos .resource a.text-link"
    );

    enlaces.forEach((enlace) => {

        enlace.addEventListener("click", async (evento) => {

            evento.preventDefault();

            if (enlace.dataset.verificando === "true") {
                return;
            }

            enlace.dataset.verificando = "true";

            try {
                if (!cliente) {
                    throw new Error("Supabase no disponible");
                }

                // Verificar usuario con Supabase Auth.
                const { data, error } =
                    await cliente.auth.getUser();

                if (error || !data?.user) {
                    abrirModal();
                    return;
                }

                // Usuario autenticado:
                // permitir acceso al recurso.
                const destino = enlace.href;

                if (destino.startsWith("https://") ||
                    destino.startsWith("http://")) {
                    window.location.assign(destino);
                }

            } catch (error) {

                console.error(
                    "Error verificando acceso:",
                    error
                );

                abrirModal();

            } finally {
                enlace.dataset.verificando = "false";
            }

        });
    });

});
