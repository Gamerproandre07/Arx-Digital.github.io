document.addEventListener("DOMContentLoaded", () => {
    const btnPrivacidad = document.getElementById("btn-privacidad");
    const btnTerminos = document.getElementById("btn-terminos");

    // Contenido de la Política de Privacidad
    const contenidoPrivacidad = `
        <h2>Política de Privacidad</h2>
        <p class="modal-subtitle">ARX DIGITAL — Última actualización: Octubre 2026</p>
        <div class="modal-body">
          <h3>1. Información que Recopilamos</h3>
          <p>Recopilamos información personal como su nombre, correo electrónico y datos de uso cuando interactúa con nuestros servicios.</p>
          <h3>2. Uso de la Información</h3>
          <p>Utilizamos los datos para brindar, mantener y mejorar nuestras soluciones informáticas y soporte personalizado.</p>
          <h3>3. Protección y Almacenamiento</h3>
          <p>Implementamos medidas de seguridad para garantizar la confidencialidad de sus datos conforme a la legislación aplicable.</p>
        </div>
    `;

    // Contenido de los Términos y Condiciones
    const contenidoTerminos = `
        <h2>Términos y Condiciones de Uso</h2>
        <p class="modal-subtitle">ARX DIGITAL — Última actualización: Octubre 2026</p>
        <div class="modal-body">
          <h3>1. Aceptación de los Términos</h3>
          <p>Al registrarse y crear una cuenta en ARX DIGITAL, el usuario acepta de manera íntegra y sin reservas los presentes Términos y Condiciones. Si no está de acuerdo con alguna disposición, deberá abstenerse de utilizar la plataforma.</p>
          <h3>2. Servicios y Uso Autorizado</h3>
          <p>ARX DIGITAL proporciona soluciones informáticas, herramientas de desarrollo y recursos digitales. El usuario se compromete a hacer un uso adecuado, legal y ético de la plataforma.</p>
          <h3>3. Registro de Cuenta y Seguridad</h3>
          <p>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas desde su cuenta.</p>
          <h3>4. Protección de Datos Personales</h3>
          <p>Los datos ingresados se procesarán conforme a nuestras normativas de privacidad vigentes, garantizando su uso exclusivo para la gestión de servicios en ARX DIGITAL.</p>
          <h3>5. Modificaciones</h3>
          <p>ARX DIGITAL se reserva el derecho de actualizar o modificar estos términos en cualquier momento notificándolo a través de la plataforma.</p>
        </div>
    `;

    // Función para abrir la ventana modal dinámicamente
    function abrirModal(htmlContenido) {
        // Evitar duplicados si ya hay una abierta
        cerrarModal();

        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.id = "modalActiva";

        const modalBox = document.createElement("div");
        modalBox.className = "modal-content";
        modalBox.innerHTML = htmlContenido;

        // Botón de la X opcional
        const closeBtn = document.createElement("span");
        closeBtn.className = "close-btn";
        closeBtn.innerHTML = "&times;";
        closeBtn.onclick = cerrarModal;

        modalBox.prepend(closeBtn);
        overlay.appendChild(modalBox);
        document.body.appendChild(overlay);

        // CERRAR AL HACER CLIC FUERA (en el fondo oscuro)
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                cerrarModal();
            }
        });
    }

    // Función para cerrar y eliminar la modal del DOM
    function cerrarModal() {
        const modalExistente = document.getElementById("modalActiva");
        if (modalExistente) {
            modalExistente.remove();
        }
    }

    // NUEVO: Cerrar la modal al presionar la tecla ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cerrarModal();
        }
    });

    // Eventos de clic en los enlaces del footer
    if (btnPrivacidad) {
        btnPrivacidad.addEventListener("click", () => abrirModal(contenidoPrivacidad));
    }

    if (btnTerminos) {
        btnTerminos.addEventListener("click", () => abrirModal(contenidoTerminos));
    }
}) ;overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        cerrarModal();
    }
});
