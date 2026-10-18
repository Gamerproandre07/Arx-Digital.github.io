document.addEventListener("DOMContentLoaded", () => {

    const chat =
        document.getElementById("arxAiChat");

    const openButton =
        document.getElementById("arxAiButton");

    const closeButton =
        document.getElementById("arxAiClose");

    const form =
        document.getElementById("arxAiForm");

    const input =
        document.getElementById("arxAiInput");

    const messages =
        document.getElementById("arxAiMessages");


    // ==========================================
    // BACKEND
    // ==========================================

    const API_URL =
        "https://arx-asistente.1554036.workers.dev";


    // ==========================================
    // MEMORIA DE LA CONVERSACIÓN
    // ==========================================

    const conversation = [];


    // ==========================================
    // ABRIR / CERRAR
    // ==========================================

    openButton.addEventListener("click", () => {

        chat.classList.toggle("active");

        if (chat.classList.contains("active")) {
            input.focus();
        }

    });


    closeButton.addEventListener("click", () => {

        chat.classList.remove("active");

    });


    // ==========================================
    // MOSTRAR MENSAJE
    // ==========================================

    function addMessage(text, type) {

        const message =
            document.createElement("div");

        message.classList.add(
            "arx-message",
            type
        );

        message.textContent = text;

        messages.appendChild(message);

        messages.scrollTop =
            messages.scrollHeight;

        return message;
    }


    // ==========================================
    // ENVIAR MENSAJE
    // ==========================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const text =
                input.value.trim();


            if (!text) {
                return;
            }


            // Mostrar pregunta
            addMessage(
                text,
                "user"
            );


            // Guardarla en memoria
            conversation.push({
                role: "user",
                content: text
            });


            input.value = "";

            input.disabled = true;


            // Indicador temporal
            const thinkingMessage =
                addMessage(
                    "ARX está escribiendo...",
                    "bot"
                );


            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                mensajes:
                                    conversation
                            })
                        }
                    );


                const data =
                    await response.json();


                thinkingMessage.remove();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "No se pudo obtener respuesta."
                    );

                }


                // Mostrar respuesta
                addMessage(
                    data.respuesta,
                    "bot"
                );


                // IMPORTANTE:
                // también guardamos lo que respondió ARX
                conversation.push({
                    role: "assistant",
                    content: data.respuesta
                });


            } catch (error) {

                if (
                    thinkingMessage.isConnected
                ) {
                    thinkingMessage.remove();
                }


                console.error(
                    "Error ARX:",
                    error
                );


                addMessage(
                    "Lo siento, tuve un problema al conectarme. Inténtalo nuevamente.",
                    "bot"
                );


                /*
                 * Quitamos la pregunta fallida
                 * del historial.
                 */

                conversation.pop();

            } finally {

                input.disabled = false;

                input.focus();

            }

        }
    );


    // ==========================================
    // PREGUNTAS RÁPIDAS
    // ==========================================

    const suggestions =
        document.querySelectorAll(
            ".arx-suggestion"
        );


    suggestions.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                input.value =
                    button.dataset.question;

                input.focus();

            }
        );

    });

});