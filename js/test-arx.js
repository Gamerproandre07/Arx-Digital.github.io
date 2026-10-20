document.addEventListener("DOMContentLoaded", () => {

    /*ELEMENTOS DEL TEST*/

    const startScreen = document.getElementById("quizStart");
    const gameScreen = document.getElementById("quizGame");
    const resultScreen = document.getElementById("quizResult");

    const startButton = document.getElementById("quizStartButton");
    const nextButton = document.getElementById("quizNextButton");
    const restartButton = document.getElementById("quizRestartButton");
    const resourcesButton = document.getElementById("quizResourcesButton");

    const questionCounter = document.getElementById("quizQuestionCounter");
    const scoreCounter = document.getElementById("quizScore");
    const progressBar = document.getElementById("quizProgress");

    const categoryText = document.getElementById("quizCategory");
    const questionText = document.getElementById("quizQuestion");
    const optionsContainer = document.getElementById("quizOptions");

    const feedback = document.getElementById("quizFeedback");
    const feedbackTitle = document.getElementById("quizFeedbackTitle");
    const feedbackText = document.getElementById("quizFeedbackText");

    const resultTitle = document.getElementById("quizResultTitle");
    const finalScore = document.getElementById("quizFinalScore");
    const resultMessage = document.getElementById("quizResultMessage");
    const recommendationText =
        document.getElementById("quizRecommendationText");


    /*PREGUNTAS*/

    const questions = [

        {
            category: "PHISHING",

            question:
                "Recibes un correo que dice que tu cuenta será suspendida si no inicias sesión inmediatamente desde un enlace. ¿Qué deberías hacer?",

            options: [
                "Abrir el enlace rápidamente para evitar que suspendan la cuenta.",
                "Responder al correo preguntando si el mensaje es verdadero.",
                "Entrar al servicio desde su aplicación o dirección oficial y verificar allí.",
                "Reenviar el correo a un amigo para preguntarle qué piensa."
            ],

            correct: 2,

            explanation:
                "Los mensajes que intentan generar urgencia pueden ser una señal de phishing. Es más seguro acceder directamente al sitio o aplicación oficial sin utilizar el enlace recibido."
        },


        {
            category: "CONTRASEÑAS",

            question:
                "¿Cuál de estas prácticas es la más recomendable para proteger tus cuentas?",

            options: [
                "Utilizar la misma contraseña segura en todas las cuentas.",
                "Usar contraseñas diferentes y difíciles de adivinar para cada cuenta.",
                "Cambiar todas tus contraseñas por tu fecha de nacimiento.",
                "Guardar todas tus contraseñas en una nota pública del celular."
            ],

            correct: 1,

            explanation:
                "Utilizar contraseñas únicas evita que el robo de una contraseña permita acceder también a tus otras cuentas."
        },


        {
            category: "AUTENTICACIÓN",

            question:
                "¿Para qué sirve la autenticación de dos factores (2FA)?",

            options: [
                "Para iniciar sesión sin utilizar ninguna contraseña.",
                "Para añadir una segunda comprobación de identidad al iniciar sesión.",
                "Para hacer que Internet funcione más rápido.",
                "Para ocultar automáticamente todas tus publicaciones."
            ],

            correct: 1,

            explanation:
                "La autenticación de dos factores añade una capa adicional de seguridad. Aunque alguien descubra tu contraseña, todavía necesitaría superar una segunda verificación."
        },


        {
            category: "INGENIERÍA SOCIAL",

            question:
                "Una persona que dice ser del soporte técnico te pide por teléfono un código de verificación que acaba de llegar a tu celular. ¿Qué haces?",

            options: [
                "Se lo doy porque trabaja en soporte.",
                "Le doy solamente la mitad del código.",
                "No comparto el código y verifico la situación mediante un canal oficial.",
                "Publico el código en redes sociales para preguntar si es verdadero."
            ],

            correct: 2,

            explanation:
                "Los códigos de verificación son confidenciales. Un atacante puede intentar convencerte de compartirlos para acceder a tu cuenta."
        },


        {
            category: "WI-FI PÚBLICO",

            question:
                "Estás conectado a una red Wi-Fi pública. ¿Qué práctica reduce el riesgo al utilizarla?",

            options: [
                "Realizar operaciones sensibles sin comprobar la red.",
                "Desactivar todas las medidas de seguridad del dispositivo.",
                "Evitar operaciones sensibles y comprobar que los sitios utilizan conexiones seguras.",
                "Compartir archivos con cualquier dispositivo conectado."
            ],

            correct: 2,

            explanation:
                "Las redes públicas requieren mayor precaución. Evita operaciones especialmente sensibles y utiliza servicios y conexiones de confianza."
        },


        {
            category: "MALWARE",

            question:
                "Descargas un archivo inesperado y tu antivirus muestra una alerta. ¿Qué deberías hacer?",

            options: [
                "Ignorar la advertencia y abrirlo.",
                "Desactivar el antivirus para poder ejecutar el archivo.",
                "No abrirlo y verificar su procedencia antes de realizar cualquier acción.",
                "Enviar el archivo a todos tus contactos."
            ],

            correct: 2,

            explanation:
                "Una alerta de seguridad no debe ignorarse. Si el archivo es inesperado o su procedencia no está clara, evita ejecutarlo y verifica primero su origen."
        },


        {
            category: "ACTUALIZACIONES",

            question:
                "¿Por qué es importante mantener actualizado el sistema operativo y las aplicaciones?",

            options: [
                "Solamente para cambiar el diseño de los programas.",
                "Porque las actualizaciones pueden corregir vulnerabilidades de seguridad.",
                "Porque elimina la necesidad de utilizar contraseñas.",
                "Porque impide completamente cualquier ataque informático."
            ],

            correct: 1,

            explanation:
                "Las actualizaciones pueden incluir correcciones para vulnerabilidades conocidas. Mantener el software actualizado reduce la exposición a ciertos ataques."
        },


        {
            category: "PRIVACIDAD",

            question:
                "¿Cuál de estas acciones ayuda a proteger tu privacidad en redes sociales?",

            options: [
                "Publicar tu ubicación en tiempo real siempre.",
                "Aceptar todas las solicitudes de amistad.",
                "Revisar quién puede ver tus publicaciones y limitar la información personal.",
                "Compartir públicamente tus datos de recuperación."
            ],

            correct: 2,

            explanation:
                "Revisar la configuración de privacidad y limitar la información personal reduce la cantidad de datos disponibles para desconocidos."
        },


        {
            category: "CUENTAS",

            question:
                "Notas un inicio de sesión que no reconoces en una de tus cuentas. ¿Qué deberías hacer?",

            options: [
                "Ignorarlo si la cuenta todavía funciona.",
                "Cambiar la contraseña, revisar las sesiones abiertas y reforzar la seguridad de la cuenta.",
                "Publicar tu contraseña para preguntar si alguien la conoce.",
                "Esperar varios meses para comprobar si vuelve a ocurrir."
            ],

            correct: 1,

            explanation:
                "Un acceso desconocido puede indicar que otra persona obtuvo acceso a la cuenta. Conviene cambiar la contraseña, cerrar sesiones desconocidas y revisar las opciones de seguridad."
        },


        {
            category: "ESTAFAS DIGITALES",

            question:
                "Recibes un mensaje diciendo que ganaste un premio, pero para recibirlo debes pagar primero una pequeña cantidad. ¿Cuál es la opción más segura?",

            options: [
                "Pagar rápidamente antes de que termine la promoción.",
                "Enviar tus datos bancarios para verificar tu identidad.",
                "Desconfiar del mensaje y comprobar la promoción mediante canales oficiales.",
                "Enviar el mensaje a otras personas para que también paguen."
            ],

            correct: 2,

            explanation:
                "Los premios inesperados que exigen pagos o información sensible son una señal de alerta. Verifica siempre la supuesta promoción utilizando canales oficiales."
        }

    ];


    /*VARIABLES*/

    let currentQuestion = 0;
    let score = 0;
    let answered = false;

    /*
       Guardaremos las categorías en las que
       el usuario se equivoca para darle una
       recomendación al terminar.
    */

    let mistakes = [];


    /*INICIAR TEST*/

    function startQuiz() {

        currentQuestion = 0;
        score = 0;
        answered = false;
        mistakes = [];

        startScreen.hidden = true;
        resultScreen.hidden = true;
        gameScreen.hidden = false;

        gameScreen.classList.remove("arx-quiz-screen-enter");
        void gameScreen.offsetWidth;
        gameScreen.classList.add("arx-quiz-screen-enter");

        showQuestion();
    }


    /*MOSTRAR PREGUNTA*/

    function showQuestion() {

        answered = false;

        feedback.hidden = true;

        const current = questions[currentQuestion];


        /* Contadores */

        questionCounter.textContent =
            `Pregunta ${currentQuestion + 1} de ${questions.length}`;

        scoreCounter.textContent =
            `${score}/${questions.length}`;


        /* Barra */

        const progress =
            ((currentQuestion + 1) / questions.length) * 100;

        progressBar.style.width = `${progress}%`;


        /* Pregunta */

        categoryText.textContent = current.category;
        questionText.textContent = current.question;


        /* Limpiar opciones anteriores */

        optionsContainer.innerHTML = "";


        const letters = ["A", "B", "C", "D"];


        current.options.forEach((option, index) => {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "arx-quiz-option";


            const letter = document.createElement("span");

            letter.className =
                "arx-quiz-option-letter";

            letter.textContent = letters[index];


            const optionText =
                document.createElement("span");

            optionText.textContent = option;


            button.appendChild(letter);
            button.appendChild(optionText);


            button.addEventListener(
                "click",
                () => selectAnswer(index, button)
            );


            optionsContainer.appendChild(button);

        });


        /* Texto del último botón */

        if (currentQuestion === questions.length - 1) {

            nextButton.textContent =
                "Ver resultado →";

        } else {

            nextButton.textContent =
                "Siguiente pregunta →";

        }

    }


    /*SELECCIONAR RESPUESTA*/

    function selectAnswer(selectedIndex, selectedButton) {

        if (answered) {
            return;
        }

        answered = true;


        const current = questions[currentQuestion];

        const buttons =
            optionsContainer.querySelectorAll(
                ".arx-quiz-option"
            );


        /* Desactivar todas */

        buttons.forEach(button => {
            button.disabled = true;
        });


        /* ¿Correcta? */

        if (selectedIndex === current.correct) {

            score++;

            selectedButton.classList.add("correct");

            feedbackTitle.textContent =
                "✓ ¡Correcto!";

        } else {

            selectedButton.classList.add("incorrect");

            /*
               Mostrar también cuál era
               la respuesta correcta.
            */

            buttons[current.correct]
                .classList.add("correct");


            feedbackTitle.textContent =
                "✕ Respuesta incorrecta";


            mistakes.push(current.category);

        }


        /* Actualizar puntuación */

        scoreCounter.textContent =
            `${score}/${questions.length}`;


        /* Explicación */

        feedbackText.textContent =
            current.explanation;

        feedback.hidden = false;


        /*
           Desplazar suavemente hacia
           la explicación en pantallas pequeñas.
        */

        if (window.innerWidth <= 560) {

            feedback.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }

    }


    /*SIGUIENTE PREGUNTA*/

    function nextQuestion() {

        if (!answered) {
            return;
        }


        currentQuestion++;


        if (currentQuestion < questions.length) {

            showQuestion();

        } else {

            showResult();

        }

    }


    /*RESULTADO*/

    function showResult() {

        gameScreen.hidden = true;
        resultScreen.hidden = false;


        finalScore.textContent =
            `${score}/${questions.length}`;


        /*
           RESULTADO SEGÚN PUNTUACIÓN
        */

        if (score === 10) {

            resultTitle.textContent =
                "¡Excelente!";

            resultMessage.textContent =
                "Has respondido correctamente todas las preguntas. Demuestras un muy buen conocimiento de las prácticas básicas de seguridad digital.";

        } else if (score >= 8) {

            resultTitle.textContent =
                "¡Muy buen resultado!";

            resultMessage.textContent =
                "Reconoces la mayoría de las situaciones de riesgo y conoces buenas prácticas para protegerte en Internet.";

        } else if (score >= 6) {

            resultTitle.textContent =
                "¡Buen trabajo!";

            resultMessage.textContent =
                "Tienes una buena base de seguridad digital, aunque todavía hay algunos temas que puedes reforzar.";

        } else if (score >= 4) {

            resultTitle.textContent =
                "Puedes mejorar";

            resultMessage.textContent =
                "Conoces algunas prácticas importantes, pero conviene reforzar varios conceptos para reconocer mejor los riesgos digitales.";

        } else {

            resultTitle.textContent =
                "Sigue aprendiendo";

            resultMessage.textContent =
                "Este test ha identificado varios temas que puedes reforzar. Explora los recursos de ARX DIGITAL y vuelve a intentarlo.";

        }


        /* Recomendación personalizada */

        showRecommendation();


        resultScreen.classList.remove(
            "arx-quiz-screen-enter"
        );

        void resultScreen.offsetWidth;

        resultScreen.classList.add(
            "arx-quiz-screen-enter"
        );


        /*
           Subimos ligeramente para que
           se vea el resultado.
        */

        document
            .getElementById("mini-test")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }


    /*RECOMENDACIÓN SEGÚN ERRORES*/

    function showRecommendation() {

        if (mistakes.length === 0) {

            recommendationText.textContent =
                "¡No fallaste ninguna pregunta! Puedes seguir explorando nuestros recursos para mantener actualizados tus conocimientos.";

            return;
        }


        /*
           Contamos qué categoría apareció
           más veces entre los errores.
        */

        const count = {};

        mistakes.forEach(category => {

            count[category] =
                (count[category] || 0) + 1;

        });


        let mainCategory = mistakes[0];

        Object.keys(count).forEach(category => {

            if (
                count[category] >
                count[mainCategory]
            ) {
                mainCategory = category;
            }

        });


        const recommendations = {

            "PHISHING":
                "Te recomendamos revisar el Kit de Supervivencia contra el Phishing disponible en esta página.",

            "CONTRASEÑAS":
                "Te recomendamos reforzar tus conocimientos sobre contraseñas únicas y protección de cuentas.",

            "AUTENTICACIÓN":
                "Revisa nuestras recomendaciones sobre verificación en dos pasos y protección de cuentas.",

            "INGENIERÍA SOCIAL":
                "Conviene reforzar cómo identificar solicitudes sospechosas y proteger códigos e información confidencial.",

            "WI-FI PÚBLICO":
                "Revisa buenas prácticas de navegación y protección de dispositivos cuando utilizas redes que no controlas.",

            "MALWARE":
                "Te recomendamos aprender más sobre archivos sospechosos, protección de dispositivos y software malicioso.",

            "ACTUALIZACIONES":
                "Recuerda mantener tus dispositivos y aplicaciones actualizados para reducir riesgos de seguridad.",

            "PRIVACIDAD":
                "Te recomendamos consultar nuestra Guía de Privacidad en Redes Sociales para Jóvenes y Padres.",

            "CUENTAS":
                "Revisa las recomendaciones sobre contraseñas, sesiones abiertas y verificación en dos pasos.",

            "ESTAFAS DIGITALES":
                "Te recomendamos reforzar cómo identificar mensajes sospechosos, solicitudes de dinero y técnicas de ingeniería social."

        };


        recommendationText.textContent =
            recommendations[mainCategory] ||
            "Sigue explorando nuestros recursos para fortalecer tus conocimientos de seguridad digital.";

    }


    /*VER RECURSOS*/

    function goToResources() {

        /*
           Llevamos al usuario a
           Recursos destacados.
        */

        const resources =
            document.getElementById("recursos");

        if (resources) {

            resources.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /*EVENTOS*/

    startButton.addEventListener(
        "click",
        startQuiz
    );


    nextButton.addEventListener(
        "click",
        nextQuestion
    );


    restartButton.addEventListener(
        "click",
        startQuiz
    );


    resourcesButton.addEventListener(
        "click",
        goToResources
    );

});