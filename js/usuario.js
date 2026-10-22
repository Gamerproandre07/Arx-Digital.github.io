"use strict";

(function () {

    // ==========================================
    // CONFIGURACIÓN DE SUPABASE
    // ==========================================

    const SUPABASE_URL =
        "https://ipxswlfragitdknatffc.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_UwSZ_MRdeUDhwyOVFd-ldQ_VIaHm8b1";


    if (!window.supabase) {
        console.error("Supabase no está cargado.");
        return;
    }


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            // ==========================================
            // BUSCAR EL ÁREA DE ACCESO
            // ==========================================

            const nav =
                document.querySelector(".site-header nav") ||
                document.querySelector("header nav") ||
                document.querySelector("nav");


            if (!nav) {
                console.warn(
                    "No se encontró la navegación principal."
                );
                return;
            }


            // Buscar enlace que lleve al login
            let loginLink =
                nav.querySelector('a[href="login.html"]');


            // También acepta rutas como ./login.html
            if (!loginLink) {

                const enlaces =
                    nav.querySelectorAll("a");

                loginLink = Array.from(enlaces).find(
                    enlace =>
                        enlace
                            .getAttribute("href")
                            ?.toLowerCase()
                            .includes("login.html")
                );
            }


            if (!loginLink) {
                console.warn(
                    "No se encontró el enlace de Acceso."
                );
                return;
            }


            // ==========================================
            // COMPROBAR SESIÓN
            // ==========================================

            const {
                data: { session },
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                console.error(
                    "Error al comprobar sesión:",
                    error
                );

                return;
            }


            // ==========================================
            // SI NO HAY SESIÓN
            // ==========================================

            if (!session) {

                loginLink.hidden = false;

                return;
            }


            // ==========================================
            // DATOS DEL USUARIO
            // ==========================================

            const usuario = session.user;

            const nombre =
                usuario.user_metadata?.nombre_completo ||
                usuario.email?.split("@")[0] ||
                "Usuario";

            const correo =
                usuario.email || "";


            // ==========================================
            // CREAR MENÚ AUTOMÁTICAMENTE
            // ==========================================

            const userMenu =
                document.createElement("div");

            userMenu.className = "user-menu";


            const userButton =
                document.createElement("button");

            userButton.type = "button";
            userButton.className = "user-button";

            userButton.setAttribute(
                "aria-expanded",
                "false"
            );


            const avatar =
                document.createElement("span");

            avatar.className = "user-avatar";
            avatar.textContent = "👤";


            const info =
                document.createElement("span");

            info.className = "user-button-info";


            const nombreElemento =
                document.createElement("strong");

            nombreElemento.textContent = nombre;


            const correoElemento =
                document.createElement("small");

            correoElemento.textContent = correo;


            const flecha =
                document.createElement("span");

            flecha.className = "user-arrow";
            flecha.textContent = "▾";


            info.appendChild(nombreElemento);
            info.appendChild(correoElemento);

            userButton.appendChild(avatar);
            userButton.appendChild(info);
            userButton.appendChild(flecha);


            // ==========================================
            // DESPLEGABLE
            // ==========================================

            const dropdown =
                document.createElement("div");

            dropdown.className = "user-dropdown";
            dropdown.hidden = true;


            const dropdownHeader =
                document.createElement("div");

            dropdownHeader.className =
                "user-dropdown-header";


            const dropdownNombre =
                document.createElement("strong");

            dropdownNombre.textContent = nombre;


            const dropdownCorreo =
                document.createElement("span");

            dropdownCorreo.textContent = correo;


            dropdownHeader.appendChild(
                dropdownNombre
            );

            dropdownHeader.appendChild(
                dropdownCorreo
            );


            const divider =
                document.createElement("div");

            divider.className =
                "user-dropdown-divider";


            const logoutButton =
                document.createElement("button");

            logoutButton.type = "button";

            logoutButton.className =
                "logout-button";

            logoutButton.textContent =
                "Cerrar sesión";


            dropdown.appendChild(
                dropdownHeader
            );

            dropdown.appendChild(
                divider
            );

            dropdown.appendChild(
                logoutButton
            );


            userMenu.appendChild(
                userButton
            );

            userMenu.appendChild(
                dropdown
            );


            // ==========================================
            // REEMPLAZAR "ACCESO"
            // ==========================================

            loginLink.replaceWith(userMenu);


            // ==========================================
            // ABRIR / CERRAR MENÚ
            // ==========================================

            userButton.addEventListener(
                "click",
                function (evento) {

                    evento.stopPropagation();

                    const abierto =
                        !dropdown.hidden;

                    dropdown.hidden =
                        abierto;

                    userButton.setAttribute(
                        "aria-expanded",
                        String(!abierto)
                    );
                }
            );


            document.addEventListener(
                "click",
                function (evento) {

                    if (
                        !dropdown.hidden &&
                        !userMenu.contains(evento.target)
                    ) {

                        dropdown.hidden = true;

                        userButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }
            );


            // ==========================================
            // CERRAR SESIÓN
            // ==========================================

            logoutButton.addEventListener(
                "click",
                async function () {

                    logoutButton.disabled = true;

                    logoutButton.textContent =
                        "Cerrando sesión...";


                    const { error } =
                        await supabaseClient.auth.signOut();


                    if (error) {

                        console.error(
                            "Error al cerrar sesión:",
                            error
                        );

                        logoutButton.disabled = false;

                        logoutButton.textContent =
                            "Cerrar sesión";

                        return;
                    }


                    window.location.replace(
                        "index.html"
                    );
                }
            );

        }
    );

})();