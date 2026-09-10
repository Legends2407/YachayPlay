/* =========================================================
   TOKEN
   ========================================================= */

const parametros =
    new URLSearchParams(
        window.location.search
    );


const token =
    parametros.get(
        "token"
    );


/* =========================================================
   ELEMENTOS
   ========================================================= */

const form =
    document.getElementById(
        "formReset"
    );


const inputPassword =
    document.getElementById(
        "password"
    );


const inputConfirmar =
    document.getElementById(
        "confirmarPassword"
    );


const errorPassword =
    document.getElementById(
        "errorPassword"
    );


const errorConfirmar =
    document.getElementById(
        "errorConfirmar"
    );


const mensajeReset =
    document.getElementById(
        "mensajeReset"
    );


const boton =
    document.getElementById(
        "btnCambiarPassword"
    );


/* =========================================================
   TOKEN INVÁLIDO
   ========================================================= */

if (!token) {

    mensajeReset.textContent =
        "❌ El enlace de recuperación no es válido.";


    form.style.display =
        "none";
}


/* =========================================================
   VALIDAR CONTRASEÑA EN TIEMPO REAL
   ========================================================= */

function validarPasswordTiempoReal() {

    const password =
        inputPassword.value;


    const confirmar =
        inputConfirmar.value;


    let passwordValida =
        true;


    /* =====================================================
       VALIDAR LONGITUD
       ===================================================== */

    if (
        password.length > 0 &&
        password.length < 5
    ) {

        errorPassword.textContent =
            "La contraseña debe tener al menos 5 caracteres.";


        inputPassword.classList.add(
            "campo-error"
        );


        inputPassword.classList.remove(
            "campo-correcto"
        );


        passwordValida =
            false;

    } else {

        errorPassword.textContent =
            "";


        inputPassword.classList.remove(
            "campo-error"
        );


        if (
            password.length >= 5
        ) {

            inputPassword.classList.add(
                "campo-correcto"
            );

        } else {

            inputPassword.classList.remove(
                "campo-correcto"
            );
        }
    }


    /* =====================================================
       VALIDAR COINCIDENCIA
       ===================================================== */

    if (
        confirmar.length === 0
    ) {

        errorConfirmar.textContent =
            "";


        errorConfirmar.classList.remove(
            "mensaje-correcto-password"
        );


        inputConfirmar.classList.remove(
            "campo-error",
            "campo-correcto"
        );


        boton.disabled =
            true;


        return false;
    }


    if (
        password !== confirmar
    ) {

        errorConfirmar.textContent =
            "❌ Las contraseñas no coinciden.";


        errorConfirmar.classList.remove(
            "mensaje-correcto-password"
        );


        inputConfirmar.classList.add(
            "campo-error"
        );


        inputConfirmar.classList.remove(
            "campo-correcto"
        );


        boton.disabled =
            true;


        return false;
    }


    /* =====================================================
       COINCIDEN
       ===================================================== */

    if (
        passwordValida &&
        password.length >= 5
    ) {

        errorConfirmar.textContent =
            "✅ Las contraseñas coinciden.";


        errorConfirmar.classList.add(
            "mensaje-correcto-password"
        );


        inputConfirmar.classList.remove(
            "campo-error"
        );


        inputConfirmar.classList.add(
            "campo-correcto"
        );


        boton.disabled =
            false;


        return true;
    }


    boton.disabled =
        true;


    return false;
}


/* =========================================================
   EVENTOS EN TIEMPO REAL
   ========================================================= */

inputPassword.addEventListener(
    "input",
    () => {

        validarPasswordTiempoReal();

        actualizarOjitoPassword(
            inputPassword
        );
    }
);


inputConfirmar.addEventListener(
    "input",
    () => {

        validarPasswordTiempoReal();

        actualizarOjitoPassword(
            inputConfirmar
        );
    }
);


/* =========================================================
   BOTÓN DESACTIVADO AL INICIO
   ========================================================= */

boton.disabled =
    true;


/* =========================================================
   ENVIAR NUEVA CONTRASEÑA
   ========================================================= */

form.addEventListener(
    "submit",

    async event => {

        event.preventDefault();


        mensajeReset.textContent =
            "";


        const password =
            inputPassword.value;


        /* =================================================
           VALIDACIÓN FINAL
           ================================================= */

        const valido =
            validarPasswordTiempoReal();


        if (!valido) {

            return;
        }


        boton.disabled =
            true;


        boton.textContent =
            "Actualizando...";


        try {

            const respuesta =
                await fetch(

                    "/reset-password",

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                token,
                                password

                            })

                    }

                );


            const data =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(

                    data.mensaje ||
                    "No se pudo cambiar la contraseña."

                );
            }


            /* =================================================
               ÉXITO
               ================================================= */

            mensajeReset.innerHTML = `

                ✅ Contraseña cambiada correctamente.

                <br><br>

                <a href="login.html">
                    Iniciar sesión
                </a>
            `;


            form.style.display =
                "none";


        } catch (error) {

            mensajeReset.textContent =
                "❌ " +
                (
                    error.message ||
                    "No se pudo cambiar la contraseña."
                );


            boton.disabled =
                false;


            boton.textContent =
                "Cambiar contraseña";
        }
    }
);

function alternarPassword(
    inputId,
    boton
) {

    const input =
        document.getElementById(
            inputId
        );


    if (!input) {
        return;
    }


    if (
        input.type === "password"
    ) {

        input.type =
            "text";


        boton.classList.add(
            "password-visible"
        );


        boton.setAttribute(
            "aria-label",
            "Ocultar contraseña"
        );


    } else {

        input.type =
            "password";


        boton.classList.remove(
            "password-visible"
        );


        boton.setAttribute(
            "aria-label",
            "Mostrar contraseña"
        );
    }
}

/* =========================================================
   MOSTRAR / OCULTAR OJITO
   ========================================================= */

function actualizarOjitoPassword(
    input
) {

    const wrapper =
        input.closest(
            ".password-wrapper"
        );


    if (!wrapper) {
        return;
    }


    const boton =
        wrapper.querySelector(
            ".btn-ver-password"
        );


    if (!boton) {
        return;
    }


    if (
        input.value.length > 0
    ) {

        boton.classList.add(
            "visible"
        );

    } else {

        boton.classList.remove(
            "visible",
            "password-visible"
        );


        input.type =
            "password";


        boton.setAttribute(
            "aria-label",
            "Mostrar contraseña"
        );
    }
}