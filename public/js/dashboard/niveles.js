const CONFIG_NIVELES = {

    1: {
        nombre: "Conoce a las personas",
        lecciones: [
            "hola",
            "adios",
            "mi_nombre",
            "como_te_llamas"
        ]
    },

    2: {
        nombre: "Mi familia",
        lecciones: [
            "familia",
            "padre",
            "madre",
            "hermano"
        ]
    },

    3: {
        nombre: "Los números",
        lecciones: [
            "numero_1_2",
            "numero_3_4",
            "numero_5_6",
            "numero_7_10"
        ]
    },

    4: {
        nombre: "Los colores",
        lecciones: [
            "color_rojo",
            "color_amarillo",
            "color_verde",
            "color_blanco_negro"
        ]
    },

    5: {
        nombre: "Los animales",
        lecciones: [
            "perro",
            "gato",
            "vaca",
            "condor"
        ]
    }

};

const COSTOS_DESBLOQUEO = {

    2: 30,
    3: 35,
    4: 40,
    5: 45

};

function calcularPorcentajeNivel(progreso, numeroNivel) {

    const lecciones =
        CONFIG_NIVELES[numeroNivel].lecciones;

    const completadas =
        lecciones.filter(idLeccion =>

            progreso.some(item =>
                item.leccion === idLeccion &&
                item.completada === true
            )

        ).length;

    return Math.round(
        (completadas / lecciones.length) * 100
    );
}

async function mostrarLecciones() {

    configurarBotonRegresar(
        null
    );

    cambiarActivo(
        "Lecciones"
    );


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Lecciones";


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

        /* ===============================================
           CONSULTAR PROGRESO Y COMPRAS
           =============================================== */

        const [
            respuestaProgreso,
            respuestaDesbloqueos
        ] =
            await Promise.all([

                fetch(
                    `/progreso/${usuario.id}`
                ),

                fetch(
                    `/niveles-desbloqueados/${usuario.id}`
                )

            ]);


        const progreso =
            await respuestaProgreso.json();


        const desbloqueos =
            await respuestaDesbloqueos.json();


        const nivelesComprados =
            new Set(

                desbloqueos.map(
                    item =>
                        Number(
                            item.nivel
                        )
                )

            );


        /* ===============================================
           PORCENTAJES
           =============================================== */

        const porcentajes = {};


        for (
            let numero = 1;
            numero <= 5;
            numero++
        ) {

            porcentajes[numero] =
                calcularPorcentajeNivel(
                    progreso,
                    numero
                );
        }


        /* ===============================================
           GENERAR TARJETAS
           =============================================== */

        document.getElementById(
            "contenido"
        ).innerHTML = `

            <h1>
                📚 Niveles de Aprendizaje
            </h1>


            <div class="niveles-grid">


                ${[1, 2, 3, 4, 5]
                    .map(numeroNivel => {


                        const nivel =
                            CONFIG_NIVELES[
                                numeroNivel
                            ];


                        const porcentaje =
                            porcentajes[
                                numeroNivel
                            ];


                        const completado =
                            porcentaje === 100;


                        /* =================================
                           NIVEL ANTERIOR TERMINADO
                           ================================= */

                        const requisitoCumplido =

                            numeroNivel === 1 ||

                            porcentajes[
                                numeroNivel - 1
                            ] === 100;


                        /* =================================
                           NIVEL COMPRADO
                           ================================= */

                        const comprado =

                            numeroNivel === 1 ||

                            nivelesComprados.has(
                                numeroNivel
                            );


                        /* =================================
                           REALMENTE ABIERTO
                           ================================= */

                        const desbloqueado =

                            numeroNivel === 1 ||

                            (
                                requisitoCumplido &&
                                comprado
                            );


                        const costo =

                            COSTOS_DESBLOQUEO[
                                numeroNivel
                            ] || 0;



                        /* =================================
                           ESTADO Y BOTÓN
                           ================================= */

                        let textoEstado = "";

                        let contenidoBoton = "";



                        /* NIVEL 1 */

                        if (numeroNivel === 1) {


                            textoEstado =
                                completado

                                    ? "Completado"

                                    : "Disponible";


                            contenidoBoton = `

                                <button
                                    class="btn-nivel"
                                    onclick="mostrarNivel1()"
                                >

                                    ${
                                        completado
                                            ? "Repasar"
                                            : porcentaje > 0
                                                ? "Continuar"
                                                : "Comenzar"
                                    }

                                </button>
                            `;


                        /* NIVEL ANTERIOR NO TERMINADO */

                        } else if (!requisitoCumplido) {


                            textoEstado =

                                `Completa el Nivel ${numeroNivel - 1} para continuar`;


                            contenidoBoton = `

                                <button
                                    class="btn-nivel"
                                    disabled
                                >

                                    🔒 Bloqueado

                                </button>
                            `;


                        /* TERMINÓ EL ANTERIOR PERO NO COMPRÓ */

                        } else if (!comprado) {


                            textoEstado =

                                `Listo para desbloquear · 🪙 ${costo}`;


                            contenidoBoton = `

                                <button
                                    class="btn-desbloquear-nivel"
                                    onclick="comprarNivel(${numeroNivel}, this)"
                                >

                                    🔓 Desbloquear · 🪙 ${costo}

                                </button>
                            `;


                        /* YA LO COMPRÓ */

                        } else {


                            textoEstado =

                                completado
                                    ? "Completado"
                                    : "Desbloqueado";


                            contenidoBoton = `

                                <button
                                    class="btn-nivel"
                                    onclick="mostrarNivel${numeroNivel}()"
                                >

                                    ${
                                        completado
                                            ? "Repasar"
                                            : porcentaje > 0
                                                ? "Continuar"
                                                : "Comenzar"
                                    }

                                </button>
                            `;
                        }



                        return `

                            <div class="nivel-card ${

                                desbloqueado

                                    ? "nivel-disponible"

                                    : requisitoCumplido

                                        ? "nivel-comprable"

                                        : "nivel-bloqueado"

                            }">


                                <h2>

                                    ${
                                        completado

                                            ? "✅"

                                            : desbloqueado

                                                ? "🟢"

                                                : requisitoCumplido

                                                    ? "🪙"

                                                    : "🔒"
                                    }

                                    Nivel ${numeroNivel}

                                </h2>


                                <p>

                                    ${nivel.nombre}

                                </p>


                                <div class="mini-progreso">


                                    <div class="mini-barra">

                                        <div
                                            class="mini-barra-fill"
                                            style="width:${porcentaje}%"
                                        >
                                        </div>

                                    </div>


                                    <span>

                                        ${porcentaje}% completado

                                    </span>


                                </div>


                                <p class="info-nivel">

                                    ${nivel.lecciones.length}
                                    lecciones

                                    <br>

                                    ${textoEstado}

                                </p>


                                ${contenidoBoton}


                            </div>
                        `;


                    })
                    .join("")}


            </div>
        `;


    } catch (error) {

        console.error(
            "Error cargando niveles:",
            error
        );
    }
}

async function comprarNivel(
    numeroNivel,
    boton
) {

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


    const costo =
        COSTOS_DESBLOQUEO[
            numeroNivel
        ];


    if (!costo) {

        return;
    }

    try {

        const respuesta =
            await fetch(

                "/desbloquear-nivel",

                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify({

                            usuario_id:
                                usuario.id,

                            nivel:
                                numeroNivel

                        })

                }

            );


        const data =
            await respuesta.json();

        /* =================================================
           ACTUALIZAR USUARIO LOCAL
           ================================================= */

        localStorage.setItem(

            "usuario",

            JSON.stringify(
                data.usuario
            )

        );


        /* =================================================
           ACTUALIZAR ENCABEZADO
           ================================================= */

        actualizarTopbarUsuario();

        celebrarCompraYachay(

            boton,

            `¡Nivel ${numeroNivel} desbloqueado!`,

            `Gastaste ${data.costo_pagado} monedas.\n¡Ya puedes comenzar a aprender!`

        );

        /* =================================================
           RECARGAR NIVELES
           ================================================= */

        mostrarLecciones();


    } catch (error) {

        console.error(
            "Error comprando nivel:",
            error
        );
    }
}

async function mostrarNivelGenerico(numeroNivel) {

    configurarBotonRegresar(
        () =>
            mostrarLecciones()
    );

    cambiarActivo("Lecciones");

    /* =========================================================
       OBTENER USUARIO
       ========================================================= */

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    if (!usuario) {

        window.location.href = "login.html";

        return;
    }


    /* =========================================================
       OBTENER CONFIGURACIÓN DEL NIVEL
       ========================================================= */

    const configuracion =
        CONFIG_NIVELES[numeroNivel];


    if (!configuracion) {

        console.error(
            `No existe configuración para el Nivel ${numeroNivel}`
        );

        return;
    }


    try {

        /* =====================================================
           OBTENER PROGRESO Y NIVELES COMPRADOS
           ===================================================== */

        const [
            resProgreso,
            resDesbloqueos
        ] = await Promise.all([

            fetch(
                `/progreso/${usuario.id}`
            ),

            fetch(
                `/niveles-desbloqueados/${usuario.id}`
            )

        ]);


        /* =====================================================
           VALIDAR RESPUESTAS DEL SERVIDOR
           ===================================================== */

        if (!resProgreso.ok) {

            throw new Error(
                "No se pudo obtener el progreso del usuario"
            );
        }


        if (!resDesbloqueos.ok) {

            throw new Error(
                "No se pudieron obtener los niveles desbloqueados"
            );
        }


        const progreso =
            await resProgreso.json();


        const desbloqueos =
            await resDesbloqueos.json();


        /* =====================================================
           CREAR LISTA DE NIVELES COMPRADOS
           ===================================================== */

        const nivelesComprados =
            new Set(

                desbloqueos.map(
                    item =>
                        Number(item.nivel)
                )

            );


        /* =====================================================
           1. VALIDAR QUE EL NIVEL ANTERIOR ESTÉ COMPLETO
           ===================================================== */

        if (numeroNivel > 1) {

            const leccionesAnteriores =
                CONFIG_NIVELES[
                    numeroNivel - 1
                ].lecciones;


            const nivelAnteriorCompletado =
                leccionesAnteriores.every(
                    idLeccion =>

                        progreso.some(item =>

                            item.leccion === idLeccion &&
                            item.completada === true

                        )
                );
        }


        /* =====================================================
           2. VALIDAR QUE EL NIVEL HAYA SIDO COMPRADO
           ===================================================== */

        if (
            numeroNivel > 1 &&
            !nivelesComprados.has(numeroNivel)
        ) {
            mostrarLecciones();
            return;
        }


        /* =====================================================
           CONFIGURAR TÍTULO
           ===================================================== */

        document.getElementById(
            "tituloPagina"
        ).textContent =
            `Nivel ${numeroNivel} - ${configuracion.nombre}`;


        /* =====================================================
           GENERAR TARJETAS DE LAS LECCIONES
           ===================================================== */

        const tarjetas =
            configuracion.lecciones
            .map((idLeccion, indice) => {


                const leccion =
                    LECCIONES[
                        idLeccion
                    ];


                /* =============================================
                   VALIDAR QUE LA LECCIÓN EXISTA
                   ============================================= */

                if (!leccion) {

                    console.error(
                        `La lección "${idLeccion}" no existe en LECCIONES`
                    );

                    return "";
                }


                /* =============================================
                   BUSCAR PROGRESO DE LA LECCIÓN
                   ============================================= */

                const registro =
                    progreso.find(
                        item =>
                            item.leccion === idLeccion
                    );


                const completada =
                    registro?.completada === true;


                /* =============================================
                   DESBLOQUEO INTERNO DE LECCIONES

                   Primera lección:
                   siempre disponible.

                   Siguientes:
                   necesitan la anterior completada.
                   ============================================= */

                const desbloqueada =

                    indice === 0 ||

                    progreso.some(item =>

                        item.leccion ===
                            configuracion.lecciones[
                                indice - 1
                            ] &&

                        item.completada === true

                    );


                /* =============================================
                   ÚLTIMO INTENTO
                   ============================================= */

                const fechaUltimoIntento =

                    registro?.fecha_ultimo_intento

                        ? new Date(
                            registro.fecha_ultimo_intento
                        ).toLocaleString()

                        : "Sin intentos";


                /* =============================================
                   TARJETA
                   ============================================= */

                return `

                    <div class="leccion-card ${

                        completada

                            ? "leccion-completada"

                            : desbloqueada

                                ? "leccion-disponible"

                                : "leccion-bloqueada"

                    }">


                        <div>


                            <h2>

                                ${leccion.icono}

                                ${leccion.nombre}

                            </h2>


                            <p>

                                ${leccion.descripcion}

                            </p>


                            <span>

                                ${

                                    completada

                                        ? "Completada"

                                        : desbloqueada

                                            ? "Disponible"

                                            : "Bloqueada"

                                }

                            </span>


                            <small>

                                Último intento:
                                ${fechaUltimoIntento}

                            </small>


                        </div>


                        <button

                            class="btn-nivel"

                            ${

                                desbloqueada

                                    ? `onclick="mostrarLeccion('${idLeccion}')"`

                                    : "disabled"

                            }

                        >

                            ${

                                completada

                                    ? "Repetir"

                                    : desbloqueada

                                        ? "Comenzar"

                                        : "Bloqueado"

                            }

                        </button>


                    </div>
                `;

            })
            .join("");


        /* =====================================================
           MOSTRAR NIVEL
           ===================================================== */

        document.getElementById(
            "contenido"
        ).innerHTML = `

            <h1>

                🟢 Nivel ${numeroNivel}:
                ${configuracion.nombre}

            </h1>


            <div class="lecciones-grid">

                ${tarjetas}

            </div>

        `;


    } catch (error) {

        console.error(
            `Error cargando Nivel ${numeroNivel}:`,
            error
        );
    }
}

/* =========================================================
   ABRIR NIVELES
   ========================================================= */

function mostrarNivel1() {

    mostrarNivelGenerico(1);
}

function mostrarNivel2() {
    mostrarNivelGenerico(2);
}

function mostrarNivel3() {
    mostrarNivelGenerico(3);
}

function mostrarNivel4() {
    mostrarNivelGenerico(4);
}

function mostrarNivel5() {
    mostrarNivelGenerico(5);
}