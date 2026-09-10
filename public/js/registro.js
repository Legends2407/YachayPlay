/* =========================================================
   YACHAYPLAY - REGISTRO
   ========================================================= */

const API_REGISTRO =
    "";


const GOOGLE_CLIENT_ID =
    "262264226216-2m3l1a3leo6v0qdo1keqsd7vs2qqt8j1.apps.googleusercontent.com";


/* =========================================================
   ELEMENTOS
   ========================================================= */

const formRegistro =
    document.getElementById(
        "formRegistro"
    );


const inputNombre =
    document.getElementById(
        "nombre"
    );


const inputApellido =
    document.getElementById(
        "apellido"
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
   MOSTRAR ERROR EN CAMPO
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
        Quitamos y volvemos a poner la clase
        para repetir la pequeña animación.
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
   LIMPIAR ERROR DE CAMPO
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
   LIMPIAR ERROR DE GOOGLE
   ========================================================= */

function limpiarErrorGoogle() {

    const errorGoogle =
        document.getElementById(
            "errorGoogle"
        );


    if (errorGoogle) {

        errorGoogle.textContent =
            "";
    }
}


/* =========================================================
   MOSTRAR ERROR DE GOOGLE
   ========================================================= */

function mostrarErrorGoogle(
    mensaje
) {

    const errorGoogle =
        document.getElementById(
            "errorGoogle"
        );


    if (errorGoogle) {

        errorGoogle.textContent =
            mensaje;
    }
}


/* =========================================================
   LIMPIAR TODOS LOS ERRORES
   ========================================================= */

function limpiarErroresRegistro() {

    limpiarErrorCampo(
        "nombre",
        "errorNombre"
    );


    limpiarErrorCampo(
        "apellido",
        "errorApellido"
    );


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
   VALIDAR CORREO
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
   VALIDAR NOMBRE / APELLIDO

   Permitimos:
   - letras
   - espacios
   - tildes
   - ñ
   ========================================================= */

function textoNombreValido(
    texto
) {

    const expresion =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;


    return expresion.test(
        texto
    );
}


/* =========================================================
   REGISTRO NORMAL
   ========================================================= */

formRegistro.addEventListener(
    "submit",

    async function(event) {

        event.preventDefault();


        limpiarErroresRegistro();


        const nombre =
            inputNombre.value
                .trim();


        const apellido =
            inputApellido.value
                .trim();


        const correo =
            inputCorreo.value
                .trim()
                .toLowerCase();


        const password =
            inputPassword.value;


        let formularioValido =
            true;


        /* =================================================
           NOMBRE
           ================================================= */

        if (!nombre) {

            mostrarErrorCampo(

                "nombre",

                "errorNombre",

                "Ingresa tu nombre."

            );


            formularioValido =
                false;


        } else if (
            nombre.length < 2
        ) {

            mostrarErrorCampo(

                "nombre",

                "errorNombre",

                "El nombre debe tener al menos 2 caracteres."

            );


            formularioValido =
                false;


        } else if (
            !textoNombreValido(
                nombre
            )
        ) {

            mostrarErrorCampo(

                "nombre",

                "errorNombre",

                "El nombre solo puede contener letras."

            );


            formularioValido =
                false;
        }


        /* =================================================
           APELLIDO
           ================================================= */

        if (!apellido) {

            mostrarErrorCampo(

                "apellido",

                "errorApellido",

                "Ingresa tu apellido."

            );


            formularioValido =
                false;


        } else if (
            apellido.length < 2
        ) {

            mostrarErrorCampo(

                "apellido",

                "errorApellido",

                "El apellido debe tener al menos 2 caracteres."

            );


            formularioValido =
                false;


        } else if (
            !textoNombreValido(
                apellido
            )
        ) {

            mostrarErrorCampo(

                "apellido",

                "errorApellido",

                "El apellido solo puede contener letras."

            );


            formularioValido =
                false;
        }


        /* =================================================
           CORREO
           ================================================= */

        if (!correo) {

            mostrarErrorCampo(

                "correo",

                "errorCorreo",

                "Ingresa tu correo electrónico."

            );


            formularioValido =
                false;


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
           CONTRASEÑA
           ================================================= */

        if (!password) {

            mostrarErrorCampo(

                "password",

                "errorPassword",

                "Ingresa una contraseña."

            );


            formularioValido =
                false;


        } else if (
            password.length < 5
        ) {

            mostrarErrorCampo(

                "password",

                "errorPassword",

                "La contraseña debe tener al menos 5 caracteres."

            );


            formularioValido =
                false;
        }


        /* =================================================
           NO ENVIAR SI HAY ERRORES
           ================================================= */

        if (!formularioValido) {

            return;
        }


        /* =================================================
           BOTÓN
           ================================================= */

        const botonRegistro =
            formRegistro.querySelector(
                'button[type="submit"]'
            );


        const textoOriginal =
            botonRegistro
                ? botonRegistro.textContent
                : "";


        if (botonRegistro) {

            botonRegistro.disabled =
                true;


            botonRegistro.textContent =
                "Creando cuenta...";
        }


        try {

            /* =============================================
               ENVIAR AL BACKEND
               ============================================= */

            const respuesta =
                await fetch(

                    `${API_REGISTRO}/register`,

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                nombre,
                                apellido,
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


                /* CORREO YA REGISTRADO */

                if (
                    data.mensaje ===
                    "El correo ya está registrado"
                ) {

                    mostrarErrorCampo(

                        "correo",

                        "errorCorreo",

                        "Este correo ya tiene una cuenta registrada."

                    );


                    return;
                }


                /* CAMPOS FALTANTES */

                if (
                    data.mensaje ===
                    "Completa todos los campos obligatorios"
                ) {

                    if (!nombre) {

                        mostrarErrorCampo(

                            "nombre",

                            "errorNombre",

                            "Ingresa tu nombre."

                        );
                    }


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

                            "Ingresa una contraseña."

                        );
                    }


                    return;
                }


                /* OTRO ERROR */

                mostrarErrorCampo(

                    "correo",

                    "errorCorreo",

                    data.mensaje ||
                    "No se pudo crear la cuenta."

                );


                return;
            }


            /* =============================================
               REGISTRO CORRECTO
               ============================================= */

            /*
            El registro normal no inicia sesión
            automáticamente.

            Lo mandamos a Login para que ingrese
            con la cuenta recién creada.
            */

            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Error registrando usuario:",
                error
            );


            mostrarErrorCampo(

                "correo",

                "errorCorreo",

                "No se pudo conectar con el servidor."

            );


        } finally {

            if (botonRegistro) {

                botonRegistro.disabled =
                    false;


                botonRegistro.textContent =
                    textoOriginal;
            }
        }
    }
);


/* =========================================================
   QUITAR ERROR AL VOLVER A ESCRIBIR
   ========================================================= */

inputNombre.addEventListener(
    "input",

    function() {

        limpiarErrorCampo(
            "nombre",
            "errorNombre"
        );
    }
);


inputApellido.addEventListener(
    "input",

    function() {

        limpiarErrorCampo(
            "apellido",
            "errorApellido"
        );
    }
);


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
   REGISTRO / LOGIN CON GOOGLE
   ========================================================= */

async function handleGoogleResponse(
    response
) {

    limpiarErroresRegistro();


    try {

        /*
        El mismo endpoint de Google sirve
        tanto para registrar como para iniciar sesión.

        Si la cuenta no existe, el backend la crea.
        */

        const respuesta =
            await fetch(

                `${API_REGISTRO}/auth/google`,

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
                "No se pudo continuar con Google."

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
           GOOGLE YA CREA LA SESIÓN JWT

           Por eso entra directamente al dashboard.
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
   INICIALIZAR GOOGLE
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
                        "signup_with",

                    shape:
                        "rectangular",

                    width:
                        300

                }

            );
        }
    }
);
