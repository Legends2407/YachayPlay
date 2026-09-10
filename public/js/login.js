/* =========================================================
   YACHAYPLAY - LOGIN
   ========================================================= */

const API_LOGIN =
    "";


/*
Usa el mismo Client ID que ya tienes
configurado para Google.
*/

const GOOGLE_CLIENT_ID =
    "262264226216-2m3l1a3leo6v0qdo1keqsd7vs2qqt8j1.apps.googleusercontent.com";


/* =========================================================
   ELEMENTOS
   ========================================================= */

const formLogin =
    document.getElementById(
        "formLogin"
    );


const inputCorreo =
    document.getElementById(
        "correo"
    );


const inputPassword =
    document.getElementById(
        "password"
    );


/* =========================================================
   MOSTRAR ERROR EN UN CAMPO
   ========================================================= */

function mostrarErrorCampo(
    inputId,
    errorId,
    mensaje
) {

    const input =
        document.getElementById(
            inputId
        );


    const error =
        document.getElementById(
            errorId
        );


    if (input) {

        /*
        Reiniciamos la animación para que
        se ejecute nuevamente si vuelve
        a cometer el mismo error.
        */

        input.classList.remove(
            "campo-error"
        );


        void input.offsetWidth;


        input.classList.add(
            "campo-error"
        );
    }


    if (error) {

        error.textContent =
            mensaje;
    }
}


/* =========================================================
   LIMPIAR ERROR DE UN CAMPO
   ========================================================= */

function limpiarErrorCampo(
    inputId,
    errorId
) {

    const input =
        document.getElementById(
            inputId
        );


    const error =
        document.getElementById(
            errorId
        );


    if (input) {

        input.classList.remove(
            "campo-error"
        );
    }


    if (error) {

        error.textContent =
            "";
    }
}


/* =========================================================
   LIMPIAR TODOS LOS ERRORES
   ========================================================= */

function limpiarErroresLogin() {

    limpiarErrorCampo(
        "correo",
        "errorCorreo"
    );


    limpiarErrorCampo(
        "password",
        "errorPassword"
    );


    limpiarErrorGoogle();
}


/* =========================================================
   VALIDAR FORMATO DE CORREO
   ========================================================= */

function correoValido(
    correo
) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return expresion.test(
        correo
    );
}


/* =========================================================
   ERROR DE GOOGLE

   Se crea automáticamente debajo
   del botón de Google.
   ========================================================= */

function obtenerElementoErrorGoogle() {

    let elemento =
        document.getElementById(
            "errorGoogle"
        );


    if (elemento) {

        return elemento;
    }


    const googleDiv =
        document.getElementById(
            "googleBtnDiv"
        );


    if (!googleDiv) {

        return null;
    }


    elemento =
        document.createElement(
            "small"
        );


    elemento.id =
        "errorGoogle";


    elemento.className =
        "mensaje-error-google";


    googleDiv.insertAdjacentElement(
        "afterend",
        elemento
    );


    return elemento;
}


function mostrarErrorGoogle(
    mensaje
) {

    const elemento =
        obtenerElementoErrorGoogle();


    if (elemento) {

        elemento.textContent =
            mensaje;
    }
}


function limpiarErrorGoogle() {

    const elemento =
        document.getElementById(
            "errorGoogle"
        );


    if (elemento) {

        elemento.textContent =
            "";
    }
}


/* =========================================================
   LOGIN NORMAL
   ========================================================= */

formLogin.addEventListener(
    "submit",

    async function(event) {

        event.preventDefault();


        limpiarErroresLogin();


        const correo =
            inputCorreo.value
                .trim();


        const password =
            inputPassword.value;


        let formularioValido =
            true;


        /* =================================================
           VALIDAR CORREO VACÍO
           ================================================= */

        if (!correo) {

            mostrarErrorCampo(

                "correo",

                "errorCorreo",

                "Ingresa tu correo electrónico."

            );


            formularioValido =
                false;


        /* =================================================
           VALIDAR FORMATO
           ================================================= */

        } else if (
            !correoValido(
                correo
            )
        ) {

            mostrarErrorCampo(

                "correo",

                "errorCorreo",

                "Ingresa un correo electrónico válido."

            );


            formularioValido =
                false;
        }


        /* =================================================
           VALIDAR CONTRASEÑA
           ================================================= */

        if (!password) {

            mostrarErrorCampo(

                "password",

                "errorPassword",

                "Ingresa tu contraseña."

            );


            formularioValido =
                false;
        }


        /* =================================================
           NO ENVIAR SI EXISTEN ERRORES
           ================================================= */

        if (!formularioValido) {

            return;
        }


        /* =================================================
           BOTÓN
           ================================================= */

        const botonIngresar =
            formLogin.querySelector(
                'button[type="submit"]'
            );


        const textoOriginal =
            botonIngresar
                ? botonIngresar.textContent
                : "";


        if (botonIngresar) {

            botonIngresar.disabled =
                true;


            botonIngresar.textContent =
                "Ingresando...";
        }


        try {

            /* =============================================
               ENVIAR AL BACKEND
               ============================================= */

            const respuesta =
                await fetch(

                    `${API_LOGIN}/login`,

                    {

                        method:
                            "POST",

                        credentials:
                            "include",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                correo,
                                password

                            })

                    }

                );


            const data =
                await respuesta.json();


            /* =============================================
               ERROR DEL BACKEND
               ============================================= */

            if (!respuesta.ok) {


                /* USUARIO NO EXISTE */

                if (
                    data.mensaje ===
                    "Usuario no encontrado"
                ) {

                    mostrarErrorCampo(

                        "correo",

                        "errorCorreo",

                        "No existe una cuenta registrada con este correo."

                    );


                    return;
                }


                /* CONTRASEÑA INCORRECTA */

                if (
                    data.mensaje ===
                    "Contraseña incorrecta"
                ) {

                    mostrarErrorCampo(

                        "password",

                        "errorPassword",

                        "La contraseña es incorrecta."

                    );


                    return;
                }


                /* CUENTA GOOGLE */

                if (
                    data.mensaje ===
                    "Esta cuenta utiliza inicio de sesión con Google."
                ) {

                    mostrarErrorCampo(

                        "correo",

                        "errorCorreo",

                        "Esta cuenta utiliza inicio de sesión con Google."

                    );


                    return;
                }


                /* CAMPOS VACÍOS DEL BACKEND */

                if (
                    data.mensaje ===
                    "Ingresa correo y contraseña"
                ) {

                    if (!correo) {

                        mostrarErrorCampo(

                            "correo",

                            "errorCorreo",

                            "Ingresa tu correo electrónico."

                        );
                    }


                    if (!password) {

                        mostrarErrorCampo(

                            "password",

                            "errorPassword",

                            "Ingresa tu contraseña."

                        );
                    }


                    return;
                }


                /* OTRO ERROR */

                mostrarErrorCampo(

                    "password",

                    "errorPassword",

                    data.mensaje ||
                    "No se pudo iniciar sesión."

                );


                return;
            }


            /* =============================================
               LOGIN CORRECTO
               ============================================= */

            localStorage.setItem(

                "usuario",

                JSON.stringify(
                    data.usuario
                )

            );


            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Error iniciando sesión:",
                error
            );


            mostrarErrorCampo(

                "password",

                "errorPassword",

                "No se pudo conectar con el servidor."

            );


        } finally {

            if (botonIngresar) {

                botonIngresar.disabled =
                    false;


                botonIngresar.textContent =
                    textoOriginal;
            }
        }
    }
);


/* =========================================================
   QUITAR ERROR AL VOLVER A ESCRIBIR
   ========================================================= */

inputCorreo.addEventListener(
    "input",

    function() {

        limpiarErrorCampo(
            "correo",
            "errorCorreo"
        );
    }
);


inputPassword.addEventListener(
    "input",

    function() {

        limpiarErrorCampo(
            "password",
            "errorPassword"
        );
    }
);


/* =========================================================
   GOOGLE LOGIN
   ========================================================= */

async function handleGoogleResponse(
    response
) {

    limpiarErroresLogin();


    try {

        const respuesta =
            await fetch(

                `${API_LOGIN}/auth/google`,

                {

                    method:
                        "POST",

                    credentials:
                        "include",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            token:
                                response.credential

                        })

                }

            );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {

            mostrarErrorGoogle(

                data.mensaje ||
                "No se pudo iniciar sesión con Google."

            );


            return;
        }


        /* =================================================
           GUARDAR USUARIO
           ================================================= */

        localStorage.setItem(

            "usuario",

            JSON.stringify(
                data.usuario
            )

        );


        /* =================================================
           ENTRAR AL DASHBOARD
           ================================================= */

        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(
            "Error con Google:",
            error
        );


        mostrarErrorGoogle(
            "No se pudo conectar con Google."
        );
    }
}


/* =========================================================
   INICIALIZAR BOTÓN DE GOOGLE
   ========================================================= */

window.addEventListener(
    "load",

    function() {

        if (
            !window.google ||
            !google.accounts ||
            !google.accounts.id
        ) {

            console.error(
                "Google Identity Services no está disponible."
            );

            return;
        }


        google.accounts.id.initialize({

            client_id:
                GOOGLE_CLIENT_ID,

            callback:
                handleGoogleResponse

        });


        const contenedorGoogle =
            document.getElementById(
                "googleBtnDiv"
            );


        if (contenedorGoogle) {

            google.accounts.id.renderButton(

                contenedorGoogle,

                {

                    theme:
                        "outline",

                    size:
                        "large",

                    text:
                        "signin_with",

                    shape:
                        "rectangular",

                    width:
                        300

                }

            );
        }
    }
);
