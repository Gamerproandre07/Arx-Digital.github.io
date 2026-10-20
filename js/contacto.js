
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. CONFIGURACIÓN DE SUPABASE
    // ==========================================

    const SUPABASE_URL =
        "https://ipxswlfragitdknatffc.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_UwSZ_MRdeUDhwyOVFd-ldQ_VIaHm8b1";

    const TABLA_CONTACTO = "Contacto";

    const URL_CONTACTO =
        `${SUPABASE_URL}/rest/v1/${encodeURIComponent(TABLA_CONTACTO)}`;


    // ==========================================
    // 2. ELEMENTOS DEL FORMULARIO
    // ==========================================

    const formulario = document.querySelector("main form");

    if (formulario) {

        const campoNombre = document.getElementById("nombre");
        const campoApellido = document.getElementById("apellido");
        const campoCorreo = document.getElementById("correo");
        const campoGrupo = document.getElementById("grupo");
        const campoMensaje = document.getElementById("mensaje");

        const botonEnviar =
            formulario.querySelector('button[type="submit"]');

        // Mensaje de estado para el usuario
        const estado = document.createElement("p");

        estado.id = "estado-formulario";
        estado.setAttribute("role", "status");
        estado.setAttribute("aria-live", "polite");

        formulario.appendChild(estado);


        // ==========================================
        // 3. MOSTRAR MENSAJES
        // ==========================================

        function mostrarMensaje(texto, tipo) {

            estado.textContent = texto;

            estado.style.marginTop = "15px";
            estado.style.fontWeight = "600";

            if (tipo === "exito") {
                estado.style.color = "#16a34a";
            } else if (tipo === "error") {
                estado.style.color = "#dc2626";
            } else {
                estado.style.color = "#64748b";
            }
        }


        // ==========================================
        // 4. ENVIAR DATOS A SUPABASE
        // ==========================================

        formulario.addEventListener("submit", async (evento) => {

            evento.preventDefault();

            // Validar los campos HTML
            if (!formulario.reportValidity()) {
                return;
            }

            // Obtener los valores del formulario
            const nombre = campoNombre.value.trim();
            const apellido = campoApellido.value.trim();
            const correo = campoCorreo.value.trim();
            const grupo = campoGrupo.value.trim();
            const comentario = campoMensaje.value.trim();

            // Evitar enviar campos vacíos
            if (
                !nombre ||
                !apellido ||
                !correo ||
                !grupo ||
                !comentario
            ) {
                mostrarMensaje(
                    "Por favor, completa todos los campos.",
                    "error"
                );
                return;
            }

            // Preparar los datos para Supabase
            const datosContacto = {
                "Nombre": nombre,
                "Apellido": apellido,
                "Correo_electrónico": correo,
                "Grupo": grupo,
                "Comentario": comentario
            };

            // Bloquear el botón durante el envío
            botonEnviar.disabled = true;
            botonEnviar.textContent = "Enviando...";

            mostrarMensaje(
                "Estamos enviando tu mensaje...",
                "info"
            );

            try {

                const respuesta = await fetch(URL_CONTACTO, {
                    method: "POST",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },

                    body: JSON.stringify(datosContacto)
                });

                // Verificar la respuesta del servidor
                if (!respuesta.ok) {

                    const errorServidor =
                        await respuesta.text();

                    throw new Error(
                        `Supabase (${respuesta.status}): ${errorServidor}`
                    );
                }

                // Confirmación de guardado
                mostrarMensaje(
                    "¡Mensaje enviado correctamente! Gracias por contactarnos.",
                    "exito"
                );

                // Limpiar los campos
                formulario.reset();

                console.log(
                    "Contacto guardado correctamente en Supabase."
                );

            } catch (error) {

                console.error(
                    "Error al guardar el contacto:",
                    error
                );

                mostrarMensaje(
                    "No pudimos enviar tu mensaje. Inténtalo nuevamente.",
                    "error"
                );

            } finally {

                // Restaurar el botón
                botonEnviar.disabled = false;
                botonEnviar.textContent = "Enviar";
            }

        });
    }


    // ==========================================
    // 5. POLÍTICA DE PRIVACIDAD
    // ==========================================

    const btnPrivacidad =
        document.getElementById("btn-privacidad");

    const btnTerminos =
        document.getElementById("btn-terminos");

    const contenidoPrivacidad = `
        <h2>Política de Privacidad</h2>

        <p class="modal-subtitle">
            ARX DIGITAL — Última actualización: Octubre 2026
        </p>

        <div class="modal-body">

            <h3>1. Información que Recopilamos</h3>
            <p>
                Recopilamos información como nombre,
                apellido, correo electrónico, grupo
                y mensajes proporcionados voluntariamente.
            </p>

            <h3>2. Uso de la Información</h3>
            <p>
                Utilizamos la información enviada
                para atender las consultas de contacto.
            </p>

            <h3>3. Protección y Almacenamiento</h3>
            <p>
                Los datos enviados se almacenan en
                nuestra base de datos de Supabase.
                Su acceso está sujeto a las políticas
                de seguridad configuradas.
            </p>

        </div>
    `;


    // ==========================================
    // 6. TÉRMINOS Y CONDICIONES
    // ==========================================

    const contenidoTerminos = `
        <h2>Términos y Condiciones de Uso</h2>

        <p class="modal-subtitle">
            ARX DIGITAL — Última actualización: Octubre 2026
        </p>

        <div class="modal-body">

            <h3>1. Aceptación de los Términos</h3>
            <p>
                Al utilizar ARX DIGITAL, el usuario
                acepta las condiciones aplicables
                a los servicios de la plataforma.
            </p>

            <h3>2. Servicios y Uso Autorizado</h3>
            <p>
                ARX DIGITAL proporciona información
                y recursos relacionados con tecnología
                y ciberseguridad.
            </p>

            <h3>3. Registro de Cuenta y Seguridad</h3>
            <p>
                El usuario es responsable de proteger
                las credenciales de su cuenta
                cuando utilice servicios de registro.
            </p>

            <h3>4. Protección de Datos Personales</h3>
            <p>
                Los datos proporcionados mediante
                el formulario de contacto se utilizarán
                para gestionar las consultas recibidas.
            </p>

            <h3>5. Modificaciones</h3>
            <p>
                ARX DIGITAL podrá actualizar
                los presentes términos cuando
                resulte necesario.
            </p>

        </div>
    `;


    // ==========================================
    // 7. ABRIR VENTANAS MODALES
    // ==========================================

    function abrirModal(htmlContenido) {

        cerrarModal();

        const overlay = document.createElement("div");

        overlay.className = "modal-overlay";
        overlay.id = "modalActiva";

        const modalBox = document.createElement("div");

        modalBox.className = "modal-content";
        modalBox.innerHTML = htmlContenido;

        // Botón para cerrar
        const closeBtn = document.createElement("span");

        closeBtn.className = "close-btn";
        closeBtn.innerHTML = "&times;";

        closeBtn.onclick = cerrarModal;

        modalBox.prepend(closeBtn);
        overlay.appendChild(modalBox);
        document.body.appendChild(overlay);

        // Cerrar al hacer clic fuera
        overlay.addEventListener("click", (evento) => {

            if (evento.target === overlay) {
                cerrarModal();
            }

        });
    }


    // ==========================================
    // 8. CERRAR VENTANAS MODALES
    // ==========================================

    function cerrarModal() {

        const modalExistente =
            document.getElementById("modalActiva");

        if (modalExistente) {
            modalExistente.remove();
        }
    }


    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            cerrarModal();
        }

    });


    // ==========================================
    // 9. EVENTOS DEL FOOTER
    // ==========================================

    if (btnPrivacidad) {

        btnPrivacidad.addEventListener("click", () => {

            abrirModal(contenidoPrivacidad);

        });
    }

    if (btnTerminos) {

        btnTerminos.addEventListener("click", () => {

            abrirModal(contenidoTerminos);

        });
    }

});
