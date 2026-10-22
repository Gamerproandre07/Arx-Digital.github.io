
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

            <div class="arx-access-icon"
                 aria-hidden="true">
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

    // ==========================================
    // UBICAR MODAL FUERA DE LOS CONTENEDORES
    // ==========================================

    // Se añade directamente al elemento raíz HTML
    // para evitar depender de la posición de
    // las secciones internas de Recursos.

    document.documentElement.appendChild(modal);

    const ventana = modal.querySelector(
        ".arx-access-modal"
    );

    const botonCerrar = modal.querySelector(
        ".arx-access-close"
    );

    const botonCancelar = modal.querySelector(
        ".arx-access-cancel"
    );

    let elementoAnterior = null;

    // ==========================================
    // ABRIR MODAL
    // ==========================================

    function abrirModal() {

        elementoAnterior = document.activeElement;

        modal.hidden = false;

        document.body.classList.add(
            "arx-modal-open"
        );

        botonCerrar.focus();
    }

    // ==========================================
    // CERRAR MODAL
    // ==========================================

    function cerrarModal() {

        modal.hidden = true;

        document.body.classList.remove(
            "arx-modal-open"
        );

        if (elementoAnterior?.isConnected) {
            elementoAnterior.focus();
        }
    }

    // ==========================================
    // EVENTOS PARA CERRAR
    // ==========================================

    botonCerrar.addEventListener(
        "click",
        cerrarModal
    );

    botonCancelar.addEventListener(
        "click",
        cerrarModal
    );

    // Cerrar haciendo clic fuera de la ventana

    modal.addEventListener("click", (evento) => {

        if (evento.target === modal) {
            cerrarModal();
        }

    });

    // ==========================================
    // CONTROL DEL TECLADO
    // ==========================================

    document.addEventListener("keydown", (evento) => {

        if (modal.hidden) {
            return;
        }

        // Cerrar con Escape
        if (evento.key === "Escape") {
            evento.preventDefault();
            cerrarModal();
            return;
        }

        // Mantener el foco dentro del modal
        if (evento.key === "Tab") {

            const elementos = [
                ...ventana.querySelectorAll(
                    'button:not([disabled]), a[href]'
                )
            ];

            if (elementos.length === 0) {
                evento.preventDefault();
                ventana.focus();
                return;
            }

            const primero = elementos[0];

            const ultimo =
                elementos[elementos.length - 1];

            if (
                evento.shiftKey &&
                document.activeElement === primero
            ) {
                evento.preventDefault();
                ultimo.focus();

            } else if (
                !evento.shiftKey &&
                document.activeElement === ultimo
            ) {
                evento.preventDefault();
                primero.focus();
            }
        }
    });

    // ==========================================
    // INICIALIZAR SUPABASE
    // ==========================================

    let cliente = null;

    if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {

        cliente = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    } else {

        console.error(
            "ARX DIGITAL: No se pudo cargar Supabase."
        );
    }

    // ==========================================
    // IDENTIFICAR LOS ENLACES DE RECURSOS
    // ==========================================

    const enlaces = document.querySelectorAll(
        "#recursos .resource a.text-link"
    );

    // ==========================================
    // VERIFICAR SESIÓN ANTES DE ACCEDER
    // ==========================================

    enlaces.forEach((enlace) => {

        enlace.addEventListener(
            "click",
            async (evento) => {

                // Detener navegación original
                evento.preventDefault();

                if (
                    enlace.dataset.verificando === "true"
                ) {
                    return;
                }

                enlace.dataset.verificando = "true";

                try {

                    if (!cliente) {
                        throw new Error(
                            "Supabase no disponible"
                        );
                    }

                    // Verificar usuario autenticado
                    const { data, error } =
                        await cliente.auth.getUser();

                    if (error || !data?.user) {

                        // Sin sesión: mostrar modal
                        abrirModal();
                        return;
                    }

                    // ==================================
                    // USUARIO CON SESIÓN INICIADA
                    // ==================================

                    const destino = enlace.href;

                    const url = new URL(
                        destino,
                        window.location.href
                    );

                    // Evitar protocolos inseguros
                    if (
                        url.protocol !== "https:" &&
                        url.protocol !== "http:"
                    ) {
                        throw new Error(
                            "Enlace no permitido"
                        );
                    }

                    // Acceder al recurso
                    window.location.assign(url.href);

                } catch (error) {

                    console.error(
                        "ARX DIGITAL - Error de acceso:",
                        error
                    );

                    abrirModal();

                } finally {

                    enlace.dataset.verificando = "false";

                }
            }
        );
    });

});
