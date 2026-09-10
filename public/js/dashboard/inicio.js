/* =========================================================
   YACHAYPLAY - INICIO DEL DASHBOARD
   ========================================================= */

let destinoContinuarInicio =
    null;


/* =========================================================
   MOSTRAR INICIO
   ========================================================= */

async function mostrarInicio() {

    configurarBotonRegresar(
        null
    );


    cambiarActivo(
        "Inicio"
    );


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Inicio";


    const contenido =
        document.getElementById(
            "contenido"
        );


    contenido.innerHTML = `

        <div class="inicio-cargando">

            🦅 Preparando tu aprendizaje...

        </div>
    `;


    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );


    if (!usuario) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        /* =================================================
           CARGAR INFORMACIÓN
           ================================================= */

        const [
            respuestaProgreso,
            respuestaDesbloqueos,
            respuestaRetos
        ] =
            await Promise.all([

                fetch(
                    `/progreso/${usuario.id}`,
                    {
                        credentials:
                            "include"
                    }
                ),

                fetch(
                    `/niveles-desbloqueados/${usuario.id}`,
                    {
                        credentials:
                            "include"
                    }
                ),

                fetch(
                    "/retos-diarios",
                    {
                        credentials:
                            "include"
                    }
                )

            ]);


        if (
            !respuestaProgreso.ok ||
            !respuestaDesbloqueos.ok ||
            !respuestaRetos.ok
        ) {

            throw new Error(
                "No se pudo cargar la información del inicio."
            );
        }


        const progreso =
            await respuestaProgreso.json();


        const desbloqueos =
            await respuestaDesbloqueos.json();


        const retos =
            await respuestaRetos.json();


        renderizarInicioDashboard(
            usuario,
            progreso,
            desbloqueos,
            retos
        );


        actualizarTopbarUsuario();


    } catch (error) {

        console.error(
            "Error cargando Inicio:",
            error
        );


        contenido.innerHTML = `

            <div class="inicio-error">

                <div class="inicio-error-icono">
                    🦅
                </div>

                <h2>
                    No pude preparar tu inicio
                </h2>

                <p>
                    Intenta recargar la página.
                </p>

            </div>
        `;
    }
}


/* =========================================================
   RENDERIZAR INICIO
   ========================================================= */

function renderizarInicioDashboard(
    usuario,
    progreso,
    desbloqueos,
    retos
) {

    const saludo =
        obtenerSaludoInicio();


    const fraseDia =
        obtenerFraseKichwaDelDia();


    const estadoAprendizaje =
        obtenerEstadoAprendizajeInicio(
            progreso,
            desbloqueos
        );


    destinoContinuarInicio =
        estadoAprendizaje.destino;


    const retosVisibles =
        obtenerRetosInicio(
            retos
        );


    const contenido =
        document.getElementById(
            "contenido"
        );


    contenido.innerHTML = `

        <div class="inicio-dashboard">


            <!-- ==========================================
                 SALUDO
                 ========================================== -->

            <section class="inicio-bienvenida">


                <div class="inicio-bienvenida-texto">


                    <span class="inicio-saludo-mini">

                        ${saludo.icono}
                        ${saludo.texto}

                    </span>


                    <h1>

                        ${saludo.texto},
                        ${escaparHtmlInicio(
                            usuario.nombre || "estudiante"
                        )}
                        👋

                    </h1>


                    <p>

                        ${saludo.mensaje}

                    </p>


                    <div class="inicio-frase-dia">


                        <span>
                            🌿 Expresión del día
                        </span>


                        <strong>

                            ${escaparHtmlInicio(
                                fraseDia.frase
                            )}

                        </strong>


                        <small>

                            Significado:
                            ${escaparHtmlInicio(
                                fraseDia.significado
                            )}

                        </small>


                    </div>


                </div>


                <div class="inicio-kuntur-bienvenida">

                    <img
                        src="assets/kuntur/feliz.png"
                        alt="Kuntur"
                    >

                </div>


            </section>



            <!-- ==========================================
                 ZONA PRINCIPAL
                 ========================================== -->

            <div class="inicio-principal-grid">


                <!-- ======================================
                     CONTINUAR APRENDIZAJE
                     ====================================== -->

                <section class="inicio-card inicio-continuar-card">


                    <div class="inicio-card-cabecera">


                        <div>

                            <span class="inicio-card-etiqueta">

                                📚 TU APRENDIZAJE

                            </span>


                            <h2>

                                ${estadoAprendizaje.titulo}

                            </h2>

                        </div>


                        <div class="inicio-nivel-badge">

                            ${estadoAprendizaje.badge}

                        </div>


                    </div>


                    <p class="inicio-card-descripcion">

                        ${estadoAprendizaje.descripcion}

                    </p>


                    ${
                        estadoAprendizaje.mostrarProgreso

                            ? `

                                <div class="inicio-progreso-info">

                                    <span>
                                        Progreso del nivel
                                    </span>

                                    <strong>
                                        ${estadoAprendizaje.porcentaje}%
                                    </strong>

                                </div>


                                <div class="inicio-progreso-barra">

                                    <div
                                        class="inicio-progreso-fill"

                                        style="
                                            width:
                                            ${estadoAprendizaje.porcentaje}%;
                                        "
                                    >
                                    </div>

                                </div>


                                <div class="inicio-siguiente-leccion">

                                    <div class="inicio-siguiente-icono">

                                        ${estadoAprendizaje.icono}

                                    </div>


                                    <div>

                                        <small>
                                            ${
                                                estadoAprendizaje
                                                    .subtituloSiguiente
                                            }
                                        </small>

                                        <strong>

                                            ${
                                                estadoAprendizaje
                                                    .siguiente
                                            }

                                        </strong>

                                    </div>

                                </div>

                            `

                            : ""
                    }


                    <button
                        class="btn-inicio-continuar"
                        type="button"
                        onclick="continuarAprendizajeInicio()"
                    >

                        ${estadoAprendizaje.textoBoton}

                    </button>


                </section>



                <!-- ======================================
                     RETOS
                     ====================================== -->

                <section class="inicio-card inicio-retos-card">


                    <div class="inicio-card-cabecera">


                        <div>

                            <span class="inicio-card-etiqueta">

                                🎯 HOY

                            </span>


                            <h2>
                                Retos del día
                            </h2>

                        </div>


                        <div class="inicio-retos-contador">

                            ${
                                retos.filter(
                                    reto =>
                                        reto.completado
                                ).length
                            }
                            /
                            ${retos.length}

                        </div>


                    </div>


                    <div class="inicio-retos-lista">

                        ${retosVisibles}

                    </div>


                    <button
                        class="btn-inicio-secundario"
                        type="button"
                        onclick="mostrarRetos()"
                    >

                        Ver todos los retos
                        →

                    </button>


                </section>


            </div>



            <!-- ==========================================
                 RECURSOS
                 ========================================== -->

            <section class="inicio-recursos">


                <div class="inicio-recurso-card">

                    <div class="inicio-recurso-icono inicio-icono-racha">

                        🔥

                    </div>


                    <div>

                        <span>
                            Racha actual
                        </span>

                        <strong>

                            ${Number(
                                usuario.racha || 0
                            )}
                            ${
                                Number(
                                    usuario.racha || 0
                                ) === 1

                                    ? "día"

                                    : "días"
                            }

                        </strong>

                    </div>

                </div>



                <div class="inicio-recurso-card">

                    <div class="inicio-recurso-icono inicio-icono-xp">

                        ⚡

                    </div>


                    <div>

                        <span>
                            Experiencia
                        </span>

                        <strong>

                            ${Number(
                                usuario.xp || 0
                            )}
                            XP

                        </strong>

                    </div>

                </div>



                <div class="inicio-recurso-card">

                    <div class="inicio-recurso-icono inicio-icono-monedas">

                        🪙

                    </div>


                    <div>

                        <span>
                            Tus monedas
                        </span>

                        <strong>

                            ${Number(
                                usuario.monedas || 0
                            )}

                        </strong>

                    </div>

                </div>


            </section>



            <!-- ==========================================
                 MENSAJE KUNTUR
                 ========================================== -->

            <section class="inicio-consejo">


                <div class="inicio-consejo-icono">

                    🦅

                </div>


                <div>

                    <span>
                        Kuntur dice:
                    </span>


                    <strong>

                        ${obtenerMensajeMotivacionalInicio(
                            progreso
                        )}

                    </strong>

                </div>


            </section>


        </div>
    `;
}


/* =========================================================
   SALUDO SEGÚN LA HORA
   ========================================================= */

function obtenerSaludoInicio() {

    const ahora =
        new Date();


    const partesHora =
        new Intl.DateTimeFormat(

            "es-EC",

            {
                hour:
                    "2-digit",

                hour12:
                    false,

                timeZone:
                    "America/Guayaquil"
            }

        ).formatToParts(
            ahora
        );


    const parteHora =
        partesHora.find(
            parte =>
                parte.type === "hour"
        );


    const hora =
        Number(
            parteHora?.value || 12
        );


    if (
        hora >= 5 &&
        hora < 12
    ) {

        return {

            texto:
                "Buenos días",

            icono:
                "☀️",

            mensaje:
                "Empieza el día avanzando un poco más en tu aprendizaje."

        };
    }


    if (
        hora >= 12 &&
        hora < 19
    ) {

        return {

            texto:
                "Buenas tardes",

            icono:
                "🌤️",

            mensaje:
                "Todavía hay tiempo para aprender algo nuevo hoy."

        };
    }


    return {

        texto:
            "Buenas noches",

        icono:
            "🌙",

        mensaje:
            "Unos minutos de práctica también cuentan. ¡Sigamos aprendiendo!"

    };
}


/* =========================================================
   EXPRESIÓN DEL DÍA
   ========================================================= */

function obtenerFraseKichwaDelDia() {

    const frases =
        Object
            .values(
                LECCIONES
            )
            .filter(
                leccion =>
                    leccion.frase &&
                    leccion.significado
            );


    if (
        frases.length === 0
    ) {

        return {

            frase:
                "Alli puncha",

            significado:
                "Hola / Buenos días"

        };
    }


    const fecha =
        new Intl.DateTimeFormat(

            "en-CA",

            {
                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                timeZone:
                    "America/Guayaquil"
            }

        ).format(
            new Date()
        );


    let numero =
        0;


    for (
        const caracter
        of fecha
    ) {

        numero +=
            caracter.charCodeAt(0);
    }


    const leccion =
        frases[
            numero %
            frases.length
        ];


    return {

        frase:
            leccion.frase,

        significado:
            leccion.significado

    };
}


/* =========================================================
   ESTADO ACTUAL DEL APRENDIZAJE
   ========================================================= */

function obtenerEstadoAprendizajeInicio(
    progreso,
    desbloqueos
) {

    const completadas =
        new Set(

            progreso
                .filter(
                    item =>
                        item.completada === true
                )
                .map(
                    item =>
                        item.leccion
                )

        );


    const comprados =
        new Set(

            desbloqueos.map(
                item =>
                    Number(
                        item.nivel
                    )
            )

        );


    /* =====================================================
       BUSCAR PRÓXIMA LECCIÓN DISPONIBLE
       ===================================================== */

    for (
        let numeroNivel = 1;
        numeroNivel <= 5;
        numeroNivel++
    ) {

        const configuracion =
            CONFIG_NIVELES[
                numeroNivel
            ];


        const nivelAnteriorCompleto =
            numeroNivel === 1 ||

            CONFIG_NIVELES[
                numeroNivel - 1
            ].lecciones.every(
                idLeccion =>
                    completadas.has(
                        idLeccion
                    )
            );


        const nivelComprado =
            numeroNivel === 1 ||

            comprados.has(
                numeroNivel
            );


        /* =================================================
           NIVEL ANTERIOR TERMINADO PERO FALTA COMPRAR
           ================================================= */

        if (
            nivelAnteriorCompleto &&
            !nivelComprado
        ) {

            return {

                titulo:
                    `Nivel ${numeroNivel}: ${configuracion.nombre}`,

                descripcion:
                    "Ya cumpliste el requisito anterior. Este nivel está listo para que lo desbloquees.",

                badge:
                    "🔒 Por desbloquear",

                porcentaje:
                    0,

                mostrarProgreso:
                    false,

                icono:
                    "🪙",

                subtituloSiguiente:
                    "Siguiente paso",

                siguiente:
                    `Desbloquear Nivel ${numeroNivel}`,

                textoBoton:
                    "🪙 Ver nivel para desbloquear",

                destino: {

                    tipo:
                        "niveles"

                }

            };
        }


        /* =================================================
           SI NO PUEDE ACCEDER TODAVÍA
           ================================================= */

        if (
            !nivelAnteriorCompleto ||
            !nivelComprado
        ) {

            continue;
        }


        const total =
            configuracion.lecciones.length;


        const cantidadCompletadas =
            configuracion.lecciones.filter(
                idLeccion =>
                    completadas.has(
                        idLeccion
                    )
            ).length;


        const porcentaje =
            Math.round(
                (
                    cantidadCompletadas /
                    total
                ) *
                100
            );


        const siguienteId =
            configuracion.lecciones.find(
                idLeccion =>
                    !completadas.has(
                        idLeccion
                    )
            );


        /* =================================================
           HAY LECCIÓN PENDIENTE
           ================================================= */

        if (siguienteId) {

            const siguienteLeccion =
                LECCIONES[
                    siguienteId
                ];


            return {

                titulo:
                    `Nivel ${numeroNivel}: ${configuracion.nombre}`,

                descripcion:

                    cantidadCompletadas === 0

                        ? "Este es tu próximo nivel de aprendizaje. ¡Comencemos!"

                        : "Continúa exactamente donde te quedaste.",

                badge:
                    `Nivel ${numeroNivel}`,

                porcentaje,

                mostrarProgreso:
                    true,

                icono:
                    siguienteLeccion?.icono ||
                    "📖",

                subtituloSiguiente:
                    cantidadCompletadas === 0
                        ? "Primera lección"
                        : "Siguiente lección",

                siguiente:
                    siguienteLeccion?.nombre ||
                    "Continuar",

                textoBoton:
                    cantidadCompletadas === 0

                        ? "▶ Comenzar aprendizaje"

                        : "▶ Continuar aprendizaje",

                destino: {

                    tipo:
                        "leccion",

                    idLeccion:
                        siguienteId

                }

            };
        }
    }


    /* =====================================================
       TODO COMPLETADO
       ===================================================== */

    return {

        titulo:
            "¡Completaste todos los niveles! 🎉",

        descripcion:
            "Has recorrido todas las lecciones disponibles de YachayPlay.",

        badge:
            "🏆 Completado",

        porcentaje:
            100,

        mostrarProgreso:
            false,

        icono:
            "🏆",

        subtituloSiguiente:
            "Tu progreso",

        siguiente:
            "Todos los niveles completados",

        textoBoton:
            "🏅 Ver mis logros",

        destino: {

            tipo:
                "logros"

        }

    };
}


/* =========================================================
   CONTINUAR
   ========================================================= */

function continuarAprendizajeInicio() {

    if (!destinoContinuarInicio) {

        mostrarLecciones();

        return;
    }


    switch (
        destinoContinuarInicio.tipo
    ) {

        case "leccion":

            mostrarLeccion(
                destinoContinuarInicio
                    .idLeccion
            );

            break;


        case "niveles":

            mostrarLecciones();

            break;


        case "logros":

            mostrarLogros();

            break;


        default:

            mostrarLecciones();

            break;
    }
}


/* =========================================================
   RETOS RESUMIDOS
   ========================================================= */

function obtenerRetosInicio(
    retos
) {

    if (
        !Array.isArray(retos) ||
        retos.length === 0
    ) {

        return `

            <div class="inicio-sin-retos">

                No hay retos disponibles hoy.

            </div>
        `;
    }


    /*
    Priorizamos:
    1. Completado pero sin reclamar
    2. En progreso
    3. Ya reclamado
    */

    const ordenados =
        [...retos]
            .sort(
                (a, b) => {

                    const prioridadA =
                        obtenerPrioridadRetoInicio(
                            a
                        );


                    const prioridadB =
                        obtenerPrioridadRetoInicio(
                            b
                        );


                    return (
                        prioridadA -
                        prioridadB
                    );
                }
            )
            .slice(
                0,
                2
            );


    return ordenados
        .map(
            reto => {

                const progreso =
                    Math.min(

                        Number(
                            reto.progreso || 0
                        ),

                        Number(
                            reto.objetivo || 1
                        )

                    );


                const objetivo =
                    Number(
                        reto.objetivo || 1
                    );


                const porcentaje =
                    Math.min(

                        100,

                        Math.round(
                            (
                                progreso /
                                objetivo
                            ) *
                            100
                        )

                    );


                let estado = "";


                if (
                    reto.reclamado
                ) {

                    estado =
                        "✅ Reclamado";

                } else if (
                    reto.completado
                ) {

                    estado =
                        "🎁 ¡Listo para reclamar!";

                } else {

                    estado =
                        `${progreso} / ${objetivo}`;
                }


                return `

                    <div class="
                        inicio-reto-mini
                        ${
                            reto.completado
                                ? "inicio-reto-completado"
                                : ""
                        }
                    ">


                        <div class="inicio-reto-mini-top">


                            <div>

                                <strong>

                                    ${escaparHtmlInicio(
                                        reto.titulo
                                    )}

                                </strong>


                                <small>

                                    ${escaparHtmlInicio(
                                        reto.descripcion
                                    )}

                                </small>

                            </div>


                            <span>

                                ${estado}

                            </span>


                        </div>


                        <div class="inicio-reto-barra">

                            <div
                                class="inicio-reto-fill"

                                style="
                                    width:
                                    ${porcentaje}%;
                                "
                            >
                            </div>

                        </div>


                    </div>
                `;

            }
        )
        .join("");
}


/* =========================================================
   PRIORIDAD RETOS
   ========================================================= */

function obtenerPrioridadRetoInicio(
    reto
) {

    if (
        reto.completado &&
        !reto.reclamado
    ) {

        return 0;
    }


    if (
        !reto.completado
    ) {

        return 1;
    }


    return 2;
}


/* =========================================================
   MENSAJE MOTIVACIONAL
   ========================================================= */

function obtenerMensajeMotivacionalInicio(
    progreso
) {

    const completadas =
        progreso.filter(
            item =>
                item.completada === true
        ).length;


    if (
        completadas === 0
    ) {

        return "El primer paso es empezar. Tu primera palabra en kichwa te espera.";
    }


    if (
        completadas < 5
    ) {

        return "Vas muy bien. Cada lección hace que lo aprendido se vuelva más familiar.";
    }


    if (
        completadas < 10
    ) {

        return "Ya estás construyendo una buena base. Sigue practicando un poco cada día.";
    }


    if (
        completadas < 20
    ) {

        return "Has avanzado bastante. Mantén tu racha y sigue acercándote a la meta.";
    }


    return "¡Completaste todas las lecciones! Repasar también es parte de aprender.";
}


/* =========================================================
   ESCAPAR TEXTO
   ========================================================= */

function escaparHtmlInicio(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}