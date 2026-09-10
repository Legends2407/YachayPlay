const parametros =
    new URLSearchParams(
        window.location.search
    );


const token =
    parametros.get(
        "token"
    );


const form =
    document.getElementById(
        "formReset"
    );


if (!token) {

    document.getElementById(
        "mensajeReset"
    ).textContent =
        "❌ El enlace de recuperación no es válido.";
}


form.addEventListener(
    "submit",

    async event => {

        event.preventDefault();


        const password =
            document.getElementById(
                "password"
            ).value;


        const confirmar =
            document.getElementById(
                "confirmarPassword"
            ).value;


        const errorPassword =
            document.getElementById(
                "errorPassword"
            );


        const errorConfirmar =
            document.getElementById(
                "errorConfirmar"
            );


        errorPassword.textContent =
            "";


        errorConfirmar.textContent =
            "";


        if (
            password.length < 5
        ) {

            errorPassword.textContent =
                "La contraseña debe tener al menos 5 caracteres.";

            return;
        }


        if (
            password !== confirmar
        ) {

            errorConfirmar.textContent =
                "Las contraseñas no coinciden.";

            return;
        }


        if (!token) {

            return;
        }


        const boton =
            form.querySelector(
                'button[type="submit"]'
            );


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
                    data.mensaje
                );
            }


            document.getElementById(
                "mensajeReset"
            ).innerHTML = `

                ✅ Contraseña cambiada correctamente.

                <br><br>

                <a href="login.html">
                    Iniciar sesión
                </a>
            `;


            form.style.display =
                "none";


        } catch (error) {

            document.getElementById(
                "mensajeReset"
            ).textContent =
                "❌ " +
                error.message;


        } finally {

            boton.disabled =
                false;


            boton.textContent =
                "Cambiar contraseña";
        }
    }
);