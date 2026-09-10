const form =
    document.getElementById(
        "formRecuperar"
    );


form.addEventListener(
    "submit",

    async event => {

        event.preventDefault();


        const correo =
            document
                .getElementById(
                    "correo"
                )
                .value
                .trim();


        const error =
            document.getElementById(
                "errorCorreo"
            );


        const mensaje =
            document.getElementById(
                "mensajeRecuperacion"
            );


        error.textContent =
            "";


        mensaje.textContent =
            "";


        if (!correo) {

            error.textContent =
                "Ingresa tu correo electrónico.";

            return;
        }


        const boton =
            form.querySelector(
                'button[type="submit"]'
            );


        boton.disabled =
            true;


        boton.textContent =
            "Enviando...";


        try {

            const respuesta =
                await fetch(

                    "/forgot-password",

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({
                                correo
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


            mensaje.textContent =
                "✅ " +
                data.mensaje;


            form.reset();


        } catch (errorPeticion) {

            mensaje.textContent =
                "❌ " +
                (
                    errorPeticion.message ||
                    "No se pudo enviar el enlace."
                );

        } finally {

            boton.disabled =
                false;


            boton.textContent =
                "Enviar enlace";
        }
    }
);