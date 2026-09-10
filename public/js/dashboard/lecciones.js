/* =========================================================
   YACHAYPLAY
   MOTOR GENERAL DE LECCIONES

   Este motor controla las 20 lecciones.
   ========================================================= */


let leccionActual = null;


/* =========================================================
   OBTENER LECCIÓN ACTUAL
   ========================================================= */

function obtenerLeccionActual() {

    return LECCIONES[
        leccionActual
    ];
}


/* =========================================================
   INICIAR LECCIÓN
   ========================================================= */

function mostrarLeccion(
    idLeccion
) {

    const leccion =
        LECCIONES[
            idLeccion
        ];


    if (!leccion) {

        console.error(
            "Lección no encontrada:",
            idLeccion
        );

        return;
    }

    configurarBotonRegresar(

        () =>
            mostrarNivelGenerico(
                leccion.nivel
            ),

        {

            confirmar:
                true,

            tipo:
                "leccion",

            titulo:
                "¿Salir de la lección?",

            mensaje:
                "El progreso de este intento todavía no se ha guardado.\nSi sales ahora, tendrás que comenzar esta lección nuevamente.",

            textoConfirmar:
                "Salir de la lección",

            textoCancelar:
                "Continuar aprendiendo"

        }

    );

    leccionActual =
        idLeccion;


    preguntaActual = 0;

    vidas = 3;

    aciertos = 0;

    pronunciacionScore = 0;


    mostrarExplicacionLeccion();
}


/* =========================================================
   EXPLICACIÓN
   ========================================================= */

function mostrarExplicacionLeccion() {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }


    document.getElementById(
        "tituloPagina"
    ).textContent =
        `Lección - ${leccion.nombre}`;


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="explicacion-layout">


            <div class="explicacion-texto">


                <h1>

                    ${leccion.titulo}

                </h1>


                <p>

                    ${leccion.introduccion}

                </p>


                <div class="palabra-kichwa">

                    ${leccion.frase}

                </div>


                <p>

                    Significa:

                    <strong>

                        ${leccion.significado}

                    </strong>.

                </p>


                <button
                    class="btn-audio"
                    onclick="reproducirPronunciacion(
                        '${leccion.pronunciacion}',
                        this
                    )"
                >

                    🔊 Escuchar pronunciación

                </button>


                <p class="nota-pronunciacion">

                    Escucha con atención
                    y repite en voz alta.

                </p>


                <button
                    class="btn-nivel"
                    onclick="mostrarPracticaPronunciacion()"
                >

                    Empezar práctica

                </button>


            </div>


            ${panelKuntur(

                "explicando",

                `Aprendamos ${leccion.nombre}`,

                leccion.mensajeKuntur

            )}


        </div>
    `;
}


/* =========================================================
   PRÁCTICA DE PRONUNCIACIÓN
   ========================================================= */

function mostrarPracticaPronunciacion() {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Práctica de pronunciación";


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="explicacion-layout">


            <div class="explicacion-texto">


                <h1>

                    🎙️ Pronuncia

                </h1>


                <p>

                    Escucha y luego repite:

                </p>


                <div class="palabra-kichwa">

                    ${leccion.frase}

                </div>


                <button
                    class="btn-audio"
                    onclick="reproducirPronunciacion(
                        '${leccion.pronunciacion}',
                        this
                    )"
                >

                    🔊 Escuchar

                </button>


                <button
                    class="btn-nivel"
                    onclick="iniciarReconocimientoVozLeccion()"
                >

                    🎙️ Hablar ahora

                </button>


                <div
                    id="resultadoPronunciacion"
                    class="resultado-pronunciacion"
                >
                </div>


                <button
                    class="btn-continuar"
                    id="btnIrPreguntas"
                    onclick="mostrarPreguntaLeccion()"
                    style="display:none;"
                >

                    Ir a preguntas

                </button>


            </div>


            ${panelKuntur(

                "escuchando",

                "Estoy escuchando",

                `Repite con calma: ${leccion.frase}`

            )}


        </div>
    `;
}


/* =========================================================
   RECONOCIMIENTO DE VOZ
   ========================================================= */

function iniciarReconocimientoVozLeccion() {

    const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;


    const reconocimiento =
        new SpeechRecognition();


    reconocimiento.lang =
        "es-EC";


    reconocimiento.interimResults =
        false;


    reconocimiento.maxAlternatives =
        1;


    document.getElementById(
        "resultadoPronunciacion"
    ).innerHTML = `

        <div class="escuchando-box">

            <p>

                🎙️ Kuntur está escuchando...

            </p>

            <div class="ondas-audio">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>
    `;


    reconocimiento.start();


    reconocimiento.onresult =
        event => {

            const textoReconocido =

                event
                    .results[0][0]
                    .transcript
                    .toLowerCase();


            evaluarPronunciacionLeccion(
                textoReconocido
            );
        };


    reconocimiento.onerror =
        () => {

            document.getElementById(
                "resultadoPronunciacion"
            ).innerHTML = `

                <p>

                    No se pudo escuchar bien.
                    Intenta otra vez.

                </p>
            `;
        };
}


/* =========================================================
   EVALUAR PRONUNCIACIÓN
   ========================================================= */

function evaluarPronunciacionLeccion(
    textoReconocido
) {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }


    const objetivo =
        leccion
            .pronunciacion
            .toLowerCase();


    const similitud =
        calcularSimilitud(

            limpiarTexto(
                textoReconocido
            ),

            limpiarTexto(
                objetivo
            )

        );


    let mensaje = "";

    let clase = "";


    if (similitud >= 95) {

        mensaje =
            "Excelente 🟢";

        clase =
            "pronunciacion-excelente";


    } else if (
        similitud >= 80
    ) {

        mensaje =
            "Muy bien 🟡";

        clase =
            "pronunciacion-bien";


    } else if (
        similitud >= 60
    ) {

        mensaje =
            "Aceptable 🟠";

        clase =
            "pronunciacion-aceptable";


    } else {

        mensaje =
            "Practiquemos otra vez 🔴";

        clase =
            "pronunciacion-mal";
    }


    pronunciacionScore =
        similitud;


    document.getElementById(
        "resultadoPronunciacion"
    ).innerHTML = `

        <h2 class="${clase}">

            ${mensaje}

        </h2>


        <p>

            Escuché:

            <strong>

                ${textoReconocido}

            </strong>

        </p>


        <p>

            Similitud:

            <strong>

                ${similitud}%

            </strong>

        </p>


        <p>

            Recuerda pronunciar despacio:

            <strong>

                ${leccion.frase}

            </strong>

        </p>
    `;


    document.getElementById(
        "btnIrPreguntas"
    ).style.display =
        "block";
}


/* =========================================================
   MOSTRAR PREGUNTA
   ========================================================= */

function mostrarPreguntaLeccion() {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }


    const pregunta =
        leccion.preguntas[
            preguntaActual
        ];


    document.getElementById(
        "tituloPagina"
    ).textContent =
        `Lección - ${leccion.nombre}`;


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="leccion-layout">


            <div class="zona-pregunta">


                <div class="vidas">

                    ${"❤️".repeat(vidas)}

                    ${"🤍".repeat(
                        Math.max(
                            0,
                            3 - vidas
                        )
                    )}

                </div>


                <p class="pregunta-numero">

                    Pregunta

                    ${preguntaActual + 1}

                    de

                    ${leccion.preguntas.length}

                </p>


                <div class="barra-progreso">

                    <div
                        class="progreso"

                        style="
                            width:
                            ${
                                (
                                    (
                                        preguntaActual + 1
                                    )
                                    /
                                    leccion.preguntas.length
                                )
                                *
                                100
                            }%
                        "
                    >
                    </div>

                </div>


                <h1>

                    ${pregunta.pregunta}

                </h1>


                <div class="opciones-grid">

                    ${pregunta.opciones
                        .map(
                            opcion => `

                                <button
                                    class="opcion"

                                    onclick='seleccionarRespuestaLeccion(
                                        this,
                                        ${JSON.stringify(opcion)}
                                    )'
                                >

                                    ${opcion}

                                </button>

                            `
                        )
                        .join("")}

                </div>


                <div
                    class="resultado"
                    id="resultado"
                >
                </div>


                <button
                    class="btn-continuar"
                    id="btnContinuar"

                    onclick="siguientePreguntaLeccion()"

                    style="display:none;"
                >

                    Continuar

                </button>


            </div>


            <div
                class="panel-aprende"
                id="panelKunturPregunta"
            >

                ${panelKuntur(

                    "pensando",

                    "Piensa con calma",

                    "Elige la respuesta que recuerdes de la explicación."

                )}

            </div>


        </div>
    `;
}


/* =========================================================
   SELECCIONAR RESPUESTA
   ========================================================= */

function seleccionarRespuestaLeccion(
    boton,
    respuestaElegida
) {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }


    const pregunta =
        leccion.preguntas[
            preguntaActual
        ];


    const resultado =
        document.getElementById(
            "resultado"
        );


    const panelDerecho =
        document.getElementById(
            "panelKunturPregunta"
        );


    const btnContinuar =
        document.getElementById(
            "btnContinuar"
        );


    document
        .querySelectorAll(
            ".opcion"
        )
        .forEach(opcion => {

            opcion.disabled =
                true;

        });


    if (
        respuestaElegida ===
        pregunta.correcta
    ) {

        aciertos++;


        boton.classList.add(
            "correcta"
        );


        const mensajeCorrecto =

            pregunta.mensajeCorrecto ||

            `<strong>${pregunta.correcta}</strong> es la respuesta correcta. ¡Muy bien!`;


        panelDerecho.innerHTML =
            panelKuntur(

                "feliz",

                "¡Excelente!",

                mensajeCorrecto

            );


        resultado.textContent =
            "✅ Respuesta correcta";


        resultado.className =
            "resultado correcto-texto";


    } else {

        vidas--;


        boton.classList.add(
            "incorrecta"
        );


        panelDerecho.innerHTML =
            panelKuntur(

                "empatico",

                "¡Casi!",

                `La respuesta correcta es:
                <strong>
                    ${pregunta.correcta}
                </strong>.
                Vamos con calma.`

            );


        resultado.className =
            "resultado incorrecto-texto";
    }


    btnContinuar.style.display =
        "block";
}


/* =========================================================
   SIGUIENTE PREGUNTA
   ========================================================= */

function siguientePreguntaLeccion() {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }


    if (vidas <= 0) {

        mostrarSinVidasLeccion();

        return;
    }


    preguntaActual++;


    if (
        preguntaActual <
        leccion.preguntas.length
    ) {

        mostrarPreguntaLeccion();


    } else {

        completarLeccionActual();
    }
}


/* =========================================================
   COMPLETAR LECCIÓN
   ========================================================= */

async function completarLeccionActual() {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {

        console.error(
            "No existe la lección actual"
        );

        return;
    }


    try {

        const data =
            await guardarLeccionYRecompensas(
                leccionActual,
                aciertos
            );


        mostrarResultadoLeccionActual(

            data.primera_vez,

            data.xp_ganada,

            data.monedas_ganadas,

            aciertos,

            leccion.preguntas.length,

            data.usuario?.racha ?? 0

        );


    } catch (error) {

        console.error(
            "Error guardando la lección:",
            error
        );
    }
}


/* =========================================================
   RESULTADO
   ========================================================= */

function mostrarResultadoLeccionActual(
    primeraVez,
    xp,
    monedas,
    aciertosObtenidos,
    totalPreguntas,
    rachaActual
) {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }

    /* =====================================================
    YA TERMINÓ LA LECCIÓN:
    REGRESAR SIN CONFIRMACIÓN
    ===================================================== */

    configurarBotonRegresar(

        () =>
            mostrarNivelGenerico(
                leccion.nivel
            ),

        {
            confirmar:
                false
        }

    );

    /* =====================================================
       PRECISIÓN
       ===================================================== */

    const precision =
        totalPreguntas > 0

            ? Math.round(
                (
                    aciertosObtenidos /
                    totalPreguntas
                ) * 100
            )

            : 0;


    /* =====================================================
       VALORACIÓN DEL RESULTADO
       ===================================================== */

    let iconoResultado = "";

    let tituloResultado = "";

    let mensajeResultado = "";

    let claseResultado = "";


    /* PERFECTO */

    if (
        aciertosObtenidos ===
        totalPreguntas
    ) {

        iconoResultado =
            "🌟";

        tituloResultado =
            "¡Lección perfecta!";

        mensajeResultado =
            "¡Excelente! Respondiste correctamente todas las preguntas.";

        claseResultado =
            "resultado-perfecto";


    /* 2 DE 3 / BUEN RESULTADO */

    } else if (
        precision >= 60
    ) {

        iconoResultado =
            "👍";

        tituloResultado =
            "¡Muy bien!";

        mensajeResultado =
            "Tuviste un buen resultado. Sigue practicando para conseguir una lección perfecta.";

        claseResultado =
            "resultado-bueno";


    /* RESULTADO BAJO */

    } else {

        iconoResultado =
            "📖";

        tituloResultado =
            "¡Sigue practicando!";

        mensajeResultado =
            "Cada intento te ayuda a aprender. Puedes repetir la lección cuando quieras.";

        claseResultado =
            "resultado-practica";
    }


    /* =====================================================
       TÍTULO SUPERIOR
       ===================================================== */

    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Resultado";


    /* =====================================================
       MOSTRAR RESULTADO
       ===================================================== */

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div
            class="
                resultado-final
                resultado-leccion-mejorado
                ${claseResultado}
            "
        >


            <!-- ==========================================
                 CABECERA
                 ========================================== -->

            <div class="resultado-celebracion">

                <div class="resultado-icono-grande">

                    ${iconoResultado}

                </div>


                <h1>

                    ${tituloResultado}

                </h1>


                <h2 class="resultado-nombre-leccion">

                    ${leccion.icono}
                    ${leccion.nombre}

                </h2>


                <p class="resultado-mensaje">

                    ${mensajeResultado}

                </p>


                <span class="resultado-tipo">

                    ${
                        primeraVez

                            ? "🎉 Completada por primera vez"

                            : "🔁 Lección repasada"
                    }

                </span>

            </div>



            <!-- ==========================================
                 RENDIMIENTO
                 ========================================== -->

            <div class="resultado-rendimiento">


                <div class="resultado-dato">

                    <span class="resultado-dato-icono">
                        ✅
                    </span>

                    <div>

                        <strong>
                            ${aciertosObtenidos}
                            de
                            ${totalPreguntas}
                        </strong>

                        <small>
                            Respuestas correctas
                        </small>

                    </div>

                </div>


                <div class="resultado-dato">

                    <span class="resultado-dato-icono">
                        🎯
                    </span>

                    <div>

                        <strong>
                            ${precision}%
                        </strong>

                        <small>
                            Precisión
                        </small>

                    </div>

                </div>


            </div>



            <!-- ==========================================
                 RECOMPENSAS
                 ========================================== -->

            <h3 class="resultado-subtitulo">

                Recompensas

            </h3>


            <div class="recompensas-final recompensas-mejoradas">


                <div class="recompensa-card">

                    <span class="recompensa-icono">
                        ⚡
                    </span>

                    <strong>
                        +${xp}
                    </strong>

                    <small>
                        XP
                    </small>

                </div>


                <div class="recompensa-card">

                    <span class="recompensa-icono">
                        🪙
                    </span>

                    <strong>
                        +${monedas}
                    </strong>

                    <small>
                        Monedas
                    </small>

                </div>


                <div class="recompensa-card">

                    <span class="recompensa-icono">
                        🔥
                    </span>

                    <strong>
                        ${rachaActual}
                    </strong>

                    <small>

                        ${
                            rachaActual === 1
                                ? "día de racha"
                                : "días de racha"
                        }

                    </small>

                </div>


            </div>



            <!-- ==========================================
                 MENSAJE SEGÚN REPETICIÓN
                 ========================================== -->

            ${
                !primeraVez

                    ? `

                        <div class="resultado-aviso-repaso">

                            📚 Al repasar una lección,
                            cada respuesta correcta
                            entrega 5 XP.

                        </div>

                    `

                    : ""
            }



            <!-- ==========================================
                 ACCIONES
                 ========================================== -->

            <div class="resultado-acciones">


                <button
                    class="btn-resultado btn-repetir-leccion"

                    onclick="
                        mostrarLeccion(
                            '${leccionActual}'
                        )
                    "
                >

                    🔁 Repetir lección

                </button>


                <button
                    class="btn-resultado btn-volver-nivel"

                    onclick="
                        mostrarNivel${leccion.nivel}()
                    "
                >

                    ← Volver al nivel

                </button>


                <button
                    class="btn-resultado btn-ver-niveles"

                    onclick="
                        mostrarLecciones()
                    "
                >

                    📚 Ver todos los niveles

                </button>


            </div>


        </div>
    `;
}

/* =========================================================
   SIN VIDAS
   ========================================================= */

function mostrarSinVidasLeccion() {

    const leccion =
        obtenerLeccionActual();


    if (!leccion) {
        return;
    }


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Repaso con Kuntur";


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="resultado-final">


            <h1>

                🦅 No te preocupes

            </h1>


            <p>

                Aprender un idioma toma práctica.

                Volvamos a repasar

                <strong>

                    ${leccion.frase}

                </strong>

                antes de intentarlo otra vez.

            </p>


            <div class="recompensas-final">

                <div>

                    ❤️ Vidas agotadas

                </div>

                <div>

                    📖 Repaso recomendado

                </div>

            </div>


            <button
                class="btn-nivel"

                onclick="mostrarLeccion('${leccionActual}')"
            >

                Repasar con Kuntur

            </button>


            <button
                class="btn-nivel"

                onclick="mostrarNivel${leccion.nivel}()"
            >

                Volver al nivel

            </button>


        </div>
    `;
}