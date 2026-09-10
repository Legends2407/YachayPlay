/* =========================================================
   YACHAYPLAY - RETOS DIARIOS
   ========================================================= */


/* =========================================================
   MOSTRAR RETOS
   ========================================================= */

async function mostrarRetos() {

    configurarBotonRegresar(
        null
    );


    cambiarActivo(
        "Retos"
    );


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Retos";


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="retos-cargando">

            🎯 Cargando retos...

        </div>
    `;


    try {

        const respuesta =
            await fetch(

                "/retos-diarios",

                {

                    credentials:
                        "include"

                }

            );


        const retos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                retos.mensaje ||
                "No se pudieron cargar los retos"
            );
        }


        mostrarTarjetasRetos(
            retos
        );


    } catch (error) {

        console.error(
            "Error cargando retos:",
            error
        );


        document.getElementById(
            "contenido"
        ).innerHTML = `

            <div class="retos-error">

                No se pudieron cargar
                los retos diarios.

            </div>
        `;
    }
}


/* =========================================================
   TARJETAS
   ========================================================= */

function mostrarTarjetasRetos(
    retos
) {

    const completados =
        retos.filter(
            reto =>
                reto.completado
        ).length;


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="retos-pagina">


            <div class="retos-header">


                <div>

                    <h1>

                        🎯 Retos diarios

                    </h1>


                    <p>

                        Completa los retos del día
                        y reclama tus recompensas.

                    </p>

                </div>


                <div class="retos-resumen">

                    ${completados}
                    /
                    ${retos.length}

                    completados

                </div>


            </div>



            <div class="retos-grid">


                ${retos
                    .map(
                        reto =>
                            crearTarjetaReto(
                                reto
                            )
                    )
                    .join("")}


            </div>


        </div>
    `;
}


/* =========================================================
   CREAR TARJETA
   ========================================================= */

function crearTarjetaReto(
    reto
) {

    const progreso =
        Number(
            reto.progreso
        );


    const objetivo =
        Number(
            reto.objetivo
        );


    const porcentaje =
        Math.min(

            100,

            Math.round(
                (
                    progreso /
                    objetivo
                ) * 100
            )

        );


    let boton = "";


    /* =====================================================
       YA RECLAMADO
       ===================================================== */

    if (reto.reclamado) {

        boton = `

            <button
                class="btn-reto-reclamado"
                disabled
            >

                ✅ Reclamado

            </button>
        `;


    /* =====================================================
       COMPLETADO
       ===================================================== */

    } else if (reto.completado) {

        boton = `

            <button
                class="btn-reclamar-reto"

                onclick="
                    reclamarReto(
                        ${reto.id}
                    )
                "
            >

                🎁 Reclamar recompensa

            </button>
        `;


    /* =====================================================
       EN PROGRESO
       ===================================================== */

    } else {

        boton = `

            <button
                class="btn-reto-pendiente"
                disabled
            >

                En progreso

            </button>
        `;
    }


    const recompensas = [];


    if (
        Number(
            reto.recompensa_xp
        ) > 0
    ) {

        recompensas.push(

            `⚡ +${reto.recompensa_xp} XP`

        );
    }


    if (
        Number(
            reto.recompensa_monedas
        ) > 0
    ) {

        recompensas.push(

            `🪙 +${reto.recompensa_monedas}`

        );
    }


    return `

        <div class="
            reto-card
            ${
                reto.completado
                    ? "reto-completado"
                    : ""
            }

            ${
                reto.reclamado
                    ? "reto-reclamado"
                    : ""
            }
        ">


            <div class="reto-info">


                <h2>

                    ${reto.titulo}

                </h2>


                <p>

                    ${reto.descripcion}

                </p>


            </div>



            <div class="reto-progreso-texto">

                <span>

                    Progreso

                </span>


                <strong>

                    ${progreso}
                    /
                    ${objetivo}

                </strong>

            </div>



            <div class="reto-barra">

                <div
                    class="reto-barra-fill"

                    style="
                        width:
                        ${porcentaje}%
                    "
                >
                </div>

            </div>



            <div class="reto-footer">


                <div class="reto-recompensa">

                    ${recompensas.join(
                        " · "
                    )}

                </div>


                ${boton}


            </div>


        </div>
    `;
}


/* =========================================================
   RECLAMAR
   ========================================================= */

async function reclamarReto(
    retoId
) {

    try {

        const respuesta =
            await fetch(

                "/retos-diarios/reclamar",

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

                            reto_id:
                                retoId

                        })

                }

            );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {
            return;
        }


        /* =================================================
           ACTUALIZAR USUARIO
           ================================================= */

        localStorage.setItem(

            "usuario",

            JSON.stringify(
                data.usuario
            )

        );

        actualizarTopbarUsuario();

        let recompensaTexto = "";

        if (
            data.recompensa_xp > 0
        ) {

            recompensaTexto +=
                `⚡ +${data.recompensa_xp} XP`;
        }


        if (
            data.recompensa_monedas > 0
        ) {

            if (recompensaTexto) {

                recompensaTexto +=
                    "\n";
            }


            recompensaTexto +=
                `🪙 +${data.recompensa_monedas} monedas`;
        }

        mostrarLogrosNuevos(
            data.logros_nuevos
        );

        reproducirSonidoRecompensa();

        lanzarConfetiYachay();

        mostrarCelebracionYachay({

            icono:
                "🎁",

            titulo:
                "¡Recompensa reclamada!",

            mensaje:
                recompensaTexto

        });

        /* =================================================
           MOSTRAR RECOMPENSA
           ================================================= */

        let mensaje =
            "🎉 ¡Recompensa reclamada!";


        if (
            data.recompensa_xp > 0
        ) {

            mensaje +=
                `\n⚡ +${data.recompensa_xp} XP`;
        }


        if (
            data.recompensa_monedas > 0
        ) {

            mensaje +=
                `\n🪙 +${data.recompensa_monedas} monedas`;
        }

        /* =================================================
           RECARGAR RETOS
           ================================================= */

        mostrarRetos();


    } catch (error) {

        console.error(
            "Error reclamando reto:",
            error
        );

    }
}