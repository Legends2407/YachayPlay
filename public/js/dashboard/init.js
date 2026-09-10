/* =========================================================
   YACHAYPLAY - INICIALIZACIÓN SEGURA
   ========================================================= */


/* =========================================================
   VERIFICAR SESIÓN
   ========================================================= */

async function iniciarDashboardSeguro() {

    try {

        const respuesta =
            await fetch(

                "/auth/me",

                {

                    credentials:
                        "include"

                }

            );


        /* =================================================
           SESIÓN INVÁLIDA
           ================================================= */

        if (!respuesta.ok) {

            localStorage.removeItem(
                "usuario"
            );


            window.location.href =
                "login.html";


            return;
        }


        const data =
            await respuesta.json();


        /* =================================================
           SINCRONIZAR USUARIO
           ================================================= */

        localStorage.setItem(

            "usuario",

            JSON.stringify(
                data.usuario
            )

        );


        /* =================================================
           INICIAR INTERFAZ
           ================================================= */

        inicializarInterfazDashboard();


        mostrarInicio();


    } catch (error) {

        console.error(
            "No se pudo validar la sesión:",
            error
        );


        localStorage.removeItem(
            "usuario"
        );


        window.location.href =
            "login.html";
    }
}


/* =========================================================
   ARRANCAR DASHBOARD
   ========================================================= */

iniciarDashboardSeguro();