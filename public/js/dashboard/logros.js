/* =========================================================
   YACHAYPLAY - LOGROS
   ========================================================= */


/* =========================================================
   MOSTRAR LOGROS
   ========================================================= */

async function mostrarLogros() {

    configurarBotonRegresar(
        null
    );


    cambiarActivo(
        "Logros"
    );


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Logros";


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="logros-cargando">

            🏅 Cargando logros...

        </div>
    `;


    try {

        const respuesta =
            await fetch(

                "/logros",

                {

                    credentials:
                        "include"

                }

            );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(

                data.mensaje ||
                "No se pudieron cargar los logros"

            );
        }

        mostrarLogrosNuevos(
            data.logros_nuevos
        );

        renderizarLogros(
            data
        );


    } catch (error) {

        console.error(
            "Error cargando logros:",
            error
        );


        document.getElementById(
            "contenido"
        ).innerHTML = `

            <div class="logros-error">

                No se pudieron cargar los logros.

            </div>
        `;
    }
}


/* =========================================================
   RENDERIZAR
   ========================================================= */

function renderizarLogros(
    data
) {

    const porcentajeGeneral =

        data.total > 0

            ? Math.round(
                (
                    data.desbloqueados /
                    data.total
                ) * 100
            )

            : 0;


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="logros-pagina">


            <!-- ==========================================
                 HEADER
                 ========================================== -->

            <div class="logros-header">


                <div>

                    <h1>

                        🏅 Mis logros

                    </h1>


                    <p>

                        Descubre todo lo que has
                        conseguido en tu camino
                        aprendiendo kichwa.

                    </p>

                </div>


                <div class="logros-resumen">

                    <strong>

                        ${data.desbloqueados}
                        /
                        ${data.total}

                    </strong>

                    <span>

                        desbloqueados

                    </span>

                </div>


            </div>



            <!-- ==========================================
                 PROGRESO GENERAL
                 ========================================== -->

            <div class="logros-progreso-general">


                <div class="logros-progreso-info">

                    <span>

                        Progreso de logros

                    </span>


                    <strong>

                        ${porcentajeGeneral}%

                    </strong>

                </div>


                <div class="logros-barra-general">

                    <div
                        class="logros-barra-general-fill"

                        style="
                            width:
                            ${porcentajeGeneral}%
                        "
                    >
                    </div>

                </div>


            </div>



            <!-- ==========================================
                 GRID
                 ========================================== -->

            <div class="logros-grid">


                ${data.logros
                    .map(
                        logro =>
                            crearTarjetaLogro(
                                logro
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

function crearTarjetaLogro(
    logro
) {

    const porcentaje =

        Math.min(

            100,

            Math.round(
                (
                    logro.progreso /
                    logro.objetivo
                ) * 100
            )

        );


    const fecha =
        logro.fecha_desbloqueo

            ? new Date(
                logro.fecha_desbloqueo
            ).toLocaleDateString(

                "es-EC",

                {
                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"
                }

            )

            : null;


    return `

        <div class="
            logro-card

            ${
                logro.desbloqueado

                    ? "logro-desbloqueado"

                    : "logro-bloqueado"
            }
        ">


            <!-- ICONO -->

            <div class="logro-icono">

                ${
                    logro.desbloqueado

                        ? logro.icono

                        : "🔒"
                }

            </div>



            <!-- INFORMACIÓN -->

            <div class="logro-contenido">


                <div class="logro-cabecera">


                    <h2>

                        ${logro.nombre}

                    </h2>


                    ${
                        logro.desbloqueado

                            ? `

                                <span class="
                                    logro-badge
                                    logro-badge-desbloqueado
                                ">

                                    ✓ Desbloqueado

                                </span>

                            `

                            : `

                                <span class="
                                    logro-badge
                                    logro-badge-progreso
                                ">

                                    En progreso

                                </span>

                            `
                    }


                </div>


                <p>

                    ${logro.descripcion}

                </p>



                <!-- PROGRESO -->

                <div class="logro-progreso-info">


                    <span>

                        ${
                            logro.desbloqueado

                                ? "Completado"

                                : "Progreso"
                        }

                    </span>


                    <strong>

                        ${logro.progreso}
                        /
                        ${logro.objetivo}

                    </strong>


                </div>


                <div class="logro-barra">


                    <div
                        class="logro-barra-fill"

                        style="
                            width:
                            ${porcentaje}%
                        "
                    >
                    </div>


                </div>



                ${
                    logro.desbloqueado &&
                    fecha

                        ? `

                            <small class="logro-fecha">

                                🏆 Desbloqueado el
                                ${fecha}

                            </small>

                        `

                        : ""
                }


            </div>


        </div>
    `;
}