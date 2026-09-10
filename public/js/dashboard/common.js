/* =========================================================
   YACHAYPLAY - FUNCIONES COMUNES
   ========================================================= */


/* =========================================================
   CAMBIAR OPCIÓN ACTIVA DEL SIDEBAR
   ========================================================= */

function cambiarActivo(opcionTexto) {

    const items =
        document.querySelectorAll(
            ".sidebar li"
        );


    items.forEach(item => {

        item.classList.remove(
            "active"
        );


        if (
            item.textContent.includes(
                opcionTexto
            )
        ) {

            item.classList.add(
                "active"
            );
        }
    });
}

/* =========================================================
   NAVEGACIÓN - BOTÓN REGRESAR
   ========================================================= */

let accionRegresoDashboard = null;

let opcionesRegresoDashboard = {confirmar: false};

/* =========================================================
   CONFIGURAR BOTÓN REGRESAR
   ========================================================= */

function configurarBotonRegresar(
    accion = null,
    opciones = {}
) {

    const boton =
        document.getElementById(
            "btnRegresar"
        );


    accionRegresoDashboard =
        accion;


    opcionesRegresoDashboard = {

        confirmar:
            false,

        titulo:
            "¿Quieres regresar?",

        mensaje:
            "",

        tipo:
            "confirm",

        textoConfirmar:
            "Regresar",

        textoCancelar:
            "Cancelar",

        ...opciones

    };


    if (!boton) {

        return;
    }


    if (
        typeof accion ===
        "function"
    ) {

        boton.classList.add(
            "visible"
        );


    } else {

        boton.classList.remove(
            "visible"
        );
    }
}


/* =========================================================
   EJECUTAR REGRESO
   ========================================================= */

async function volverDashboard() {

    if (
        typeof accionRegresoDashboard !==
        "function"
    ) {

        return;
    }


    /* =====================================================
       ¿REQUIERE CONFIRMACIÓN?
       ===================================================== */

    if (
        opcionesRegresoDashboard.confirmar
    ) {

        const confirmar =
            await confirmarYachay({

                tipo:
                    opcionesRegresoDashboard.tipo,

                titulo:
                    opcionesRegresoDashboard.titulo,

                mensaje:
                    opcionesRegresoDashboard.mensaje,

                textoConfirmar:
                    opcionesRegresoDashboard.textoConfirmar,

                textoCancelar:
                    opcionesRegresoDashboard.textoCancelar

            });


        if (!confirmar) {

            return;
        }
    }


    accionRegresoDashboard();
}

/* =========================================================
   VARIABLES COMPARTIDAS DE LAS LECCIONES
   ========================================================= */

let preguntaActual = 0;
let vidas = 3;
let aciertos = 0;
let pronunciacionScore = 0;


/* =========================================================
   GUARDAR LECCIÓN Y RECIBIR RECOMPENSAS
   ========================================================= */

async function guardarLeccionYRecompensas(
    idLeccion,
    cantidadAciertos
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

        throw new Error(
            "Usuario no encontrado"
        );
    }


    const respuesta =
        await fetch(

            "/guardar-leccion",

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

                        leccion:
                            idLeccion,

                        aciertos:
                            cantidadAciertos

                    })

            }

        );


    const data =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            data.mensaje ||
            "No se pudo guardar la lección"
        );
    }


    localStorage.setItem(

        "usuario",

        JSON.stringify(
            data.usuario
        )

    );


    if (
        typeof actualizarTopbarUsuario ===
        "function"
    ) {

        actualizarTopbarUsuario();
    }

    mostrarLogrosNuevos(
        data.logros_nuevos
    );

    return data;
}


/* =========================================================
   REPRODUCIR PRONUNCIACIÓN
   ========================================================= */

function reproducirPronunciacion(
    texto,
    boton = null
) {

    const voz =
        new SpeechSynthesisUtterance(
            texto
        );


    voz.lang =
        "es-EC";


    voz.rate =
        0.85;


    if (boton) {

        boton.classList.add(
            "hablando"
        );
    }


    voz.onend =
        () => {

            if (boton) {

                boton.classList.remove(
                    "hablando"
                );
            }
        };


    speechSynthesis.speak(
        voz
    );
}


/* =========================================================
   LIMPIAR TEXTO
   ========================================================= */

function limpiarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^\w\s]/gi,
            ""
        )
        .trim();
}


/* =========================================================
   CALCULAR SIMILITUD
   ========================================================= */

function calcularSimilitud(
    a,
    b
) {

    const distancia =
        distanciaLevenshtein(
            a,
            b
        );


    const maxLength =
        Math.max(
            a.length,
            b.length
        );


    if (maxLength === 0) {

        return 100;
    }


    return Math.round(

        (
            (
                maxLength -
                distancia
            )
            /
            maxLength
        )
        *
        100

    );
}


/* =========================================================
   DISTANCIA LEVENSHTEIN
   ========================================================= */

function distanciaLevenshtein(
    a,
    b
) {

    const matriz = [];


    for (
        let i = 0;
        i <= b.length;
        i++
    ) {

        matriz[i] = [i];
    }


    for (
        let j = 0;
        j <= a.length;
        j++
    ) {

        matriz[0][j] =
            j;
    }


    for (
        let i = 1;
        i <= b.length;
        i++
    ) {

        for (
            let j = 1;
            j <= a.length;
            j++
        ) {

            if (
                b.charAt(i - 1) ===
                a.charAt(j - 1)
            ) {

                matriz[i][j] =
                    matriz[
                        i - 1
                    ][
                        j - 1
                    ];

            } else {

                matriz[i][j] =
                    Math.min(

                        matriz[
                            i - 1
                        ][
                            j - 1
                        ] + 1,

                        matriz[
                            i
                        ][
                            j - 1
                        ] + 1,

                        matriz[
                            i - 1
                        ][
                            j
                        ] + 1

                    );
            }
        }
    }


    return matriz[
        b.length
    ][
        a.length
    ];
}


/* =========================================================
   KUNTUR
   ========================================================= */

const imagenesKuntur = {

    explicando:
        "assets/kuntur/explicando.png",

    escuchando:
        "assets/kuntur/escuchando.png",

    feliz:
        "assets/kuntur/feliz.png",

    empatico:
        "assets/kuntur/empatico.png",

    celebrando:
        "assets/kuntur/celebrando.png",

    orgulloso:
        "assets/kuntur/orgulloso.png",

    pensando:
        "assets/kuntur/pensando.png"

};


function panelKuntur(
    tipo,
    titulo,
    mensaje
) {

    return `

        <div class="mascota-box">

            <img
                src="${imagenesKuntur[tipo]}"
                class="mascota-animada"
            >

            <div class="globo-mascota">

                <h2>
                    ${titulo}
                </h2>

                <p>
                    ${mensaje}
                </p>

            </div>

        </div>
    `;
}

/* =========================================================
   NOTIFICACIONES DE LOGROS
   ========================================================= */

let colaNotificacionesLogros = [];

let mostrandoNotificacionLogro =
    false;


/* =========================================================
   RECIBIR LOGROS NUEVOS
   ========================================================= */

function mostrarLogrosNuevos(
    logros
) {

    if (
        !Array.isArray(logros) ||
        logros.length === 0
    ) {

        return;
    }


    colaNotificacionesLogros.push(
        ...logros
    );


    procesarColaLogros();
}


/* =========================================================
   MOSTRAR UNO POR UNO
   ========================================================= */

function procesarColaLogros() {

    if (
        mostrandoNotificacionLogro ||
        colaNotificacionesLogros.length === 0
    ) {

        return;
    }


    mostrandoNotificacionLogro =
        true;


    const logro =
        colaNotificacionesLogros.shift();


    const notificacion =
        document.createElement(
            "div"
        );


    notificacion.className =
        "notificacion-logro";


    notificacion.innerHTML = `

        <div class="notificacion-logro-brillo">
        </div>


        <div class="notificacion-logro-titulo">

            🏆 ¡NUEVO LOGRO!

        </div>


        <div class="notificacion-logro-contenido">


            <div class="notificacion-logro-icono">

                ${logro.icono}

            </div>


            <div>


                <strong>

                    ${logro.nombre}

                </strong>


                <p>

                    ${logro.descripcion}

                </p>


            </div>


        </div>
    `;


    document.body.appendChild(
        notificacion
    );


    /* =====================================================
       ENTRADA
       ===================================================== */

    requestAnimationFrame(
        () => {

            notificacion.classList.add(
                "visible"
            );
        }
    );


    /* =====================================================
       SALIDA
       ===================================================== */

    setTimeout(
        () => {

            notificacion.classList.remove(
                "visible"
            );


            setTimeout(
                () => {

                    notificacion.remove();


                    mostrandoNotificacionLogro =
                        false;


                    procesarColaLogros();

                },

                350
            );

        },

        4000
    );
}

/* =========================================================
   MODAL GLOBAL YACHAYPLAY
   ========================================================= */

let modalYachayActivo =
    false;


/* =========================================================
   MOSTRAR MODAL
   ========================================================= */

function mostrarModalYachay({

    tipo = "info",

    titulo = "YachayPlay",

    mensaje = "",

    textoConfirmar = "Aceptar",

    textoCancelar = "Cancelar",

    mostrarCancelar = false

} = {}) {

    return new Promise(
        resolve => {


            /* =============================================
               SI YA EXISTE UNO, ELIMINARLO
               ============================================= */

            const anterior =
                document.getElementById(
                    "modalYachayOverlay"
                );


            if (anterior) {

                anterior.remove();
            }


            modalYachayActivo =
                true;


            /* =============================================
               ICONOS
               ============================================= */

            const iconos = {

                info:
                    "ℹ️",

                success:
                    "✅",

                error:
                    "❌",

                warning:
                    "⚠️",

                confirm:
                    "❓",

                logout:
                    "🚪",

                compra:
                    "🪙",

                leccion:
                    "📚"

            };


            const icono =
                iconos[tipo] ||
                "ℹ️";


            /* =============================================
               OVERLAY
               ============================================= */

            const overlay =
                document.createElement(
                    "div"
                );


            overlay.id =
                "modalYachayOverlay";


            overlay.className =
                "modal-yachay-overlay";


            /* =============================================
               MODAL
               ============================================= */

            const modal =
                document.createElement(
                    "div"
                );


            modal.className =
                `modal-yachay modal-yachay-${tipo}`;


            /* =============================================
               ICONO
               ============================================= */

            const elementoIcono =
                document.createElement(
                    "div"
                );


            elementoIcono.className =
                "modal-yachay-icono";


            elementoIcono.textContent =
                icono;


            /* =============================================
               TÍTULO
               ============================================= */

            const elementoTitulo =
                document.createElement(
                    "h2"
                );


            elementoTitulo.className =
                "modal-yachay-titulo";


            elementoTitulo.textContent =
                titulo;


            /* =============================================
               MENSAJE
               ============================================= */

            const elementoMensaje =
                document.createElement(
                    "p"
                );


            elementoMensaje.className =
                "modal-yachay-mensaje";


            elementoMensaje.textContent =
                mensaje;


            /* =============================================
               BOTONES
               ============================================= */

            const acciones =
                document.createElement(
                    "div"
                );


            acciones.className =
                "modal-yachay-acciones";


            /* CANCELAR */

            let btnCancelar = null;


            if (mostrarCancelar) {

                btnCancelar =
                    document.createElement(
                        "button"
                    );


                btnCancelar.type =
                    "button";


                btnCancelar.className =
                    "modal-yachay-btn modal-yachay-cancelar";


                btnCancelar.textContent =
                    textoCancelar;


                acciones.appendChild(
                    btnCancelar
                );
            }


            /* CONFIRMAR */

            const btnConfirmar =
                document.createElement(
                    "button"
                );


            btnConfirmar.type =
                "button";


            btnConfirmar.className =
                "modal-yachay-btn modal-yachay-confirmar";


            btnConfirmar.textContent =
                textoConfirmar;


            acciones.appendChild(
                btnConfirmar
            );


            /* =============================================
               ARMAR MODAL
               ============================================= */

            modal.appendChild(
                elementoIcono
            );


            modal.appendChild(
                elementoTitulo
            );


            modal.appendChild(
                elementoMensaje
            );


            modal.appendChild(
                acciones
            );


            overlay.appendChild(
                modal
            );


            document.body.appendChild(
                overlay
            );


            /* =============================================
               BLOQUEAR SCROLL
               ============================================= */

            document.body.classList.add(
                "modal-yachay-abierto"
            );


            /* =============================================
               CERRAR
               ============================================= */

            function cerrarModal(
                resultado
            ) {

                if (!modalYachayActivo) {
                    return;
                }


                modalYachayActivo =
                    false;


                overlay.classList.remove(
                    "visible"
                );


                document.body.classList.remove(
                    "modal-yachay-abierto"
                );


                document.removeEventListener(
                    "keydown",
                    manejarTeclado
                );


                setTimeout(
                    () => {

                        overlay.remove();

                        resolve(
                            resultado
                        );

                    },

                    220
                );
            }


            /* =============================================
               TECLADO
               ============================================= */

            function manejarTeclado(
                event
            ) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    cerrarModal(
                        false
                    );
                }


                if (
                    event.key ===
                    "Enter"
                ) {

                    cerrarModal(
                        true
                    );
                }
            }


            document.addEventListener(
                "keydown",
                manejarTeclado
            );


            /* =============================================
               EVENTOS
               ============================================= */

            btnConfirmar.addEventListener(
                "click",
                () => {

                    cerrarModal(
                        true
                    );
                }
            );


            if (btnCancelar) {

                btnCancelar.addEventListener(
                    "click",
                    () => {

                        cerrarModal(
                            false
                        );
                    }
                );
            }


            /*
            Si es solo un aviso,
            permitimos cerrar tocando fuera.

            Las confirmaciones no se cierran
            accidentalmente tocando el fondo.
            */

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                            overlay &&
                        !mostrarCancelar
                    ) {

                        cerrarModal(
                            false
                        );
                    }
                }
            );


            /* =============================================
               ANIMACIÓN ENTRADA
               ============================================= */

            requestAnimationFrame(
                () => {

                    overlay.classList.add(
                        "visible"
                    );


                    btnConfirmar.focus();
                }
            );

        }
    );
}


/* =========================================================
   AVISO
   ========================================================= */

function avisoYachay(
    titulo,
    mensaje,
    tipo = "info"
) {

    return mostrarModalYachay({

        tipo,

        titulo,

        mensaje,

        textoConfirmar:
            "Entendido",

        mostrarCancelar:
            false

    });
}


/* =========================================================
   CONFIRMACIÓN
   ========================================================= */

function confirmarYachay({

    titulo = "¿Estás seguro?",

    mensaje = "",

    tipo = "confirm",

    textoConfirmar = "Confirmar",

    textoCancelar = "Cancelar"

} = {}) {

    return mostrarModalYachay({

        tipo,

        titulo,

        mensaje,

        textoConfirmar,

        textoCancelar,

        mostrarCancelar:
            true

    });
}

/* =========================================================
   CELEBRACIÓN / NOTIFICACIÓN YACHAYPLAY
   ========================================================= */

let colaCelebracionesYachay = [];

let celebracionYachayActiva =
    false;


/* =========================================================
   AGREGAR CELEBRACIÓN
   ========================================================= */

function mostrarCelebracionYachay({

    icono = "🎉",

    titulo = "¡Excelente!",

    mensaje = ""

} = {}) {

    colaCelebracionesYachay.push({

        icono,
        titulo,
        mensaje

    });


    procesarCelebracionesYachay();
}


/* =========================================================
   MOSTRAR UNA POR UNA
   ========================================================= */

function procesarCelebracionesYachay() {

    if (
        celebracionYachayActiva ||
        colaCelebracionesYachay.length === 0
    ) {

        return;
    }


    celebracionYachayActiva =
        true;


    const celebracion =
        colaCelebracionesYachay.shift();


    const elemento =
        document.createElement(
            "div"
        );


    elemento.className =
        "celebracion-yachay";


    elemento.innerHTML = `

        <div class="celebracion-yachay-brillo">
        </div>


        <div class="celebracion-yachay-icono">

            ${celebracion.icono}

        </div>


        <div class="celebracion-yachay-texto">

            <strong>

                ${celebracion.titulo}

            </strong>


            <p>

                ${celebracion.mensaje}

            </p>

        </div>


        <div class="celebracion-particulas">

            <span>✦</span>
            <span>●</span>
            <span>✦</span>
            <span>●</span>
            <span>✦</span>
            <span>●</span>

        </div>
    `;


    document.body.appendChild(
        elemento
    );


    requestAnimationFrame(
        () => {

            elemento.classList.add(
                "visible"
            );

        }
    );


    setTimeout(
        () => {

            elemento.classList.add(
                "saliendo"
            );


            setTimeout(
                () => {

                    elemento.remove();


                    celebracionYachayActiva =
                        false;


                    procesarCelebracionesYachay();

                },

                400
            );

        },

        3200
    );
}

/* =========================================================
   CONFETI YACHAYPLAY
   ========================================================= */

function lanzarConfetiYachay() {

    /* Evitar tener dos confetis al mismo tiempo */

    const anterior =
        document.getElementById(
            "confetiYachay"
        );


    if (anterior) {

        anterior.remove();
    }


    /* =====================================================
       CONTENEDOR
       ===================================================== */

    const contenedor =
        document.createElement(
            "div"
        );


    contenedor.id =
        "confetiYachay";


    contenedor.className =
        "confeti-yachay";


    document.body.appendChild(
        contenedor
    );


    /* =====================================================
       COLORES DE YACHAYPLAY
       ===================================================== */

    const colores = [

        "#7b1fd3", // morado

        "#a61ed4",

        "#e91e83", // rosado

        "#ff5ca8",

        "#ffb703", // amarillo

        "#ffffff",

        "#29c6da"

    ];


    /* =====================================================
       CREAR PARTÍCULAS
       ===================================================== */

    const cantidad =
        110;


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const particula =
            document.createElement(
                "span"
            );


        particula.className =
            "confeti-particula";


        /* POSICIÓN HORIZONTAL */

        particula.style.left =
            `${Math.random() * 100}%`;


        /* COLOR */

        particula.style.background =
            colores[
                Math.floor(
                    Math.random() *
                    colores.length
                )
            ];


        /* TAMAÑO */

        const ancho =
            6 +
            Math.random() * 7;


        const alto =
            8 +
            Math.random() * 10;


        particula.style.width =
            `${ancho}px`;


        particula.style.height =
            `${alto}px`;


        /* RETARDO */

        particula.style.animationDelay =
            `${Math.random() * .5}s`;


        /* DURACIÓN */

        particula.style.animationDuration =
            `${1.8 + Math.random() * 1.4}s`;


        /* MOVIMIENTO LATERAL */

        particula.style.setProperty(

            "--movimiento-x",

            `${
                -100 +
                Math.random() * 200
            }px`

        );


        /* ROTACIÓN */

        particula.style.setProperty(

            "--rotacion",

            `${
                360 +
                Math.random() * 720
            }deg`

        );


        /* Algunas piezas redondas */

        if (
            Math.random() > .75
        ) {

            particula.classList.add(
                "confeti-redondo"
            );
        }


        contenedor.appendChild(
            particula
        );
    }


    /* =====================================================
       ELIMINAR DESPUÉS
       ===================================================== */

    setTimeout(
        () => {

            contenedor.remove();

        },

        3800
    );
}

/* =========================================================
   SONIDO DE RECOMPENSA YACHAYPLAY
   ========================================================= */

function reproducirSonidoRecompensa() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const contexto =
            new AudioContext();


        const ahora =
            contexto.currentTime;


        /*
        Pequeña melodía ascendente.
        */

        const notas = [

            {
                frecuencia: 523.25,
                inicio: 0,
                duracion: 0.13
            },

            {
                frecuencia: 659.25,
                inicio: 0.12,
                duracion: 0.13
            },

            {
                frecuencia: 783.99,
                inicio: 0.24,
                duracion: 0.16
            },

            {
                frecuencia: 1046.50,
                inicio: 0.39,
                duracion: 0.32
            }

        ];


        notas.forEach(
            nota => {

                const oscilador =
                    contexto.createOscillator();


                const ganancia =
                    contexto.createGain();


                oscilador.type =
                    "sine";


                oscilador.frequency.setValueAtTime(

                    nota.frecuencia,

                    ahora + nota.inicio

                );


                /*
                Entrada y salida suave para evitar
                sonidos bruscos.
                */

                ganancia.gain.setValueAtTime(

                    0,

                    ahora + nota.inicio

                );


                ganancia.gain.linearRampToValueAtTime(

                    0.16,

                    ahora +
                    nota.inicio +
                    0.025

                );


                ganancia.gain.exponentialRampToValueAtTime(

                    0.001,

                    ahora +
                    nota.inicio +
                    nota.duracion

                );


                oscilador.connect(
                    ganancia
                );


                ganancia.connect(
                    contexto.destination
                );


                oscilador.start(
                    ahora + nota.inicio
                );


                oscilador.stop(

                    ahora +
                    nota.inicio +
                    nota.duracion

                );

            }
        );


        /*
        Cerramos el contexto cuando termina.
        */

        setTimeout(
            () => {

                contexto.close();

            },

            1200
        );


    } catch (error) {

        console.warn(
            "No se pudo reproducir el sonido de recompensa:",
            error
        );
    }
}

/* =========================================================
   EFECTO DE COMPRA YACHAYPLAY
   ========================================================= */

function lanzarEfectoCompra(
    boton
) {

    if (!boton) {
        return;
    }


    const rect =
        boton.getBoundingClientRect();


    const centroX =
        rect.left +
        rect.width / 2;


    const centroY =
        rect.top +
        rect.height / 2;


    /* =====================================================
       CONTENEDOR
       ===================================================== */

    const contenedor =
        document.createElement(
            "div"
        );


    contenedor.className =
        "efecto-compra-yachay";


    document.body.appendChild(
        contenedor
    );


    /* =====================================================
       PARTÍCULAS
       ===================================================== */

    const simbolos = [
        "💵",
        "💸",
        "🪙",
        "✦",
        "✨"
    ];


    const cantidad =
        24;


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const particula =
            document.createElement(
                "span"
            );


        particula.className =
            "particula-compra-yachay";


        particula.textContent =
            simbolos[
                Math.floor(
                    Math.random() *
                    simbolos.length
                )
            ];


        /* PUNTO DE ORIGEN */

        particula.style.left =
            `${centroX}px`;


        particula.style.top =
            `${centroY}px`;


        /* DIRECCIÓN */

        const angulo =
            Math.random() *
            Math.PI *
            2;


        const distancia =
            70 +
            Math.random() * 120;


        const movimientoX =
            Math.cos(angulo) *
            distancia;


        /*
        Favorecemos que muchas partículas
        salgan hacia arriba.
        */

        const movimientoY =
            Math.sin(angulo) *
            distancia -
            60;


        particula.style.setProperty(

            "--compra-x",

            `${movimientoX}px`

        );


        particula.style.setProperty(

            "--compra-y",

            `${movimientoY}px`

        );


        particula.style.setProperty(

            "--compra-rotacion",

            `${
                -180 +
                Math.random() * 720
            }deg`

        );


        particula.style.animationDelay =
            `${Math.random() * .12}s`;


        particula.style.fontSize =
            `${
                .75 +
                Math.random() * .75
            }rem`;


        contenedor.appendChild(
            particula
        );
    }


    /* =====================================================
       EFECTO DEL PROPIO BOTÓN
       ===================================================== */

    boton.classList.remove(
        "boton-compra-celebrando"
    );


    void boton.offsetWidth;


    boton.classList.add(
        "boton-compra-celebrando"
    );


    setTimeout(
        () => {

            boton.classList.remove(
                "boton-compra-celebrando"
            );

        },

        700
    );


    /* =====================================================
       ELIMINAR PARTÍCULAS
       ===================================================== */

    setTimeout(
        () => {

            contenedor.remove();

        },

        1800
    );
}


/* =========================================================
   SONIDO TIPO CAJA REGISTRADORA
   ========================================================= */

function reproducirSonidoCompra() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const contexto =
            new AudioContext();


        const ahora =
            contexto.currentTime;


        /* =================================================
           PRIMER "TING"
           ================================================= */

        crearNotaCompra(
            contexto,
            ahora,
            880,
            .12,
            .16
        );


        /* =================================================
           SEGUNDO "TING" MÁS AGUDO
           ================================================= */

        crearNotaCompra(
            contexto,
            ahora + .09,
            1320,
            .17,
            .15
        );


        /* =================================================
           PEQUEÑO "CHING" FINAL
           ================================================= */

        crearNotaCompra(
            contexto,
            ahora + .20,
            1760,
            .28,
            .12
        );


        /*
        Pequeño golpe grave para darle
        sensación de caja registradora.
        */

        crearNotaCompra(
            contexto,
            ahora + .02,
            220,
            .10,
            .08,
            "triangle"
        );


        setTimeout(
            () => {

                contexto.close();

            },

            1000
        );


    } catch (error) {

        console.warn(
            "No se pudo reproducir el sonido de compra:",
            error
        );
    }
}


/* =========================================================
   CREAR NOTA DEL SONIDO DE COMPRA
   ========================================================= */

function crearNotaCompra(
    contexto,
    inicio,
    frecuencia,
    duracion,
    volumen,
    tipo = "sine"
) {

    const oscilador =
        contexto.createOscillator();


    const ganancia =
        contexto.createGain();


    oscilador.type =
        tipo;


    oscilador.frequency.setValueAtTime(
        frecuencia,
        inicio
    );


    ganancia.gain.setValueAtTime(
        0,
        inicio
    );


    ganancia.gain.linearRampToValueAtTime(

        volumen,

        inicio + .015

    );


    ganancia.gain.exponentialRampToValueAtTime(

        .001,

        inicio + duracion

    );


    oscilador.connect(
        ganancia
    );


    ganancia.connect(
        contexto.destination
    );


    oscilador.start(
        inicio
    );


    oscilador.stop(
        inicio + duracion
    );
}


/* =========================================================
   CELEBRACIÓN COMPLETA DE COMPRA
   ========================================================= */

function celebrarCompraYachay(
    boton,
    titulo,
    mensaje
) {

    reproducirSonidoCompra();


    lanzarEfectoCompra(
        boton
    );


    mostrarCelebracionYachay({

        icono:
            "🛍️",

        titulo:
            titulo,

        mensaje:
            mensaje

    });
}