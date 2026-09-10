/* =========================================================
   INTERFAZ DEL DASHBOARD

   SIDEBAR
   PERFIL
   FOTO
   CONFIGURACIÓN
   MODO OSCURO
   SESIÓN
   ========================================================= */


const API_DASHBOARD =
    "";


let fotoPerfilSeleccionada =
    null;


let urlPreviewFotoPerfil =
    null;

/* =========================================================
   MOSTRAR FOTO O INICIAL
   ========================================================= */

function colocarFotoOInicial(
    imagen,
    inicialElemento,
    usuario
) {

    if (!imagen || !inicialElemento || !usuario) {
        return;
    }


    /* =====================================================
       OBTENER INICIAL DEL NOMBRE
       ===================================================== */

    const nombre =
        usuario.nombre
            ? usuario.nombre.trim()
            : "Usuario";


    const inicial =
        nombre.length > 0
            ? nombre.charAt(0).toUpperCase()
            : "U";


    /*
    Siempre actualizamos la letra.

    Así si no existe foto:
    Jonathan -> J
    Ana      -> A
    Pedro    -> P
    */

    inicialElemento.textContent =
        inicial;


    /* =====================================================
       COMPROBAR FOTO
       ===================================================== */

    const urlFoto =
        obtenerUrlFotoPerfil(
            usuario.foto_perfil
        );


    /* =====================================================
       TIENE FOTO
       ===================================================== */

    if (urlFoto) {

        imagen.src =
            urlFoto;


        imagen.style.display =
            "block";


        inicialElemento.style.display =
            "none";


        /*
        Si por alguna razón el archivo
        no existe, mostramos la inicial.
        */

        imagen.onerror =
            function() {

                imagen.src = "";

                imagen.style.display =
                    "none";


                inicialElemento.style.display =
                    "flex";


                inicialElemento.textContent =
                    inicial;
            };


        return;
    }


    /* =====================================================
       NO TIENE FOTO
       ===================================================== */

    imagen.onerror =
        null;


    imagen.src =
        "";


    imagen.removeAttribute(
        "src"
    );


    imagen.style.display =
        "none";


    inicialElemento.style.display =
        "flex";


    inicialElemento.textContent =
        inicial;
}


/* =========================================================
   ACTUALIZAR TOPBAR
   ========================================================= */

function actualizarTopbarUsuario() {

    const usuarioGuardado =
        localStorage.getItem(
            "usuario"
        );


    if (!usuarioGuardado) {
        return;
    }


    const usuario =
        JSON.parse(
            usuarioGuardado
        );


    /* =====================================================
       NOMBRE
       ===================================================== */

    const nombreElemento =
        document.getElementById(
            "nombreUsuario"
        );


    if (nombreElemento) {

        nombreElemento.textContent =
            usuario.nombre ||
            "Usuario";
    }


    /* =====================================================
       MONEDAS
       ===================================================== */

    const monedasElemento =
        document.getElementById(
            "topbarMonedas"
        );


    if (monedasElemento) {

        monedasElemento.textContent =
            usuario.monedas ?? 0;
    }


    /* =====================================================
       RACHA
       ===================================================== */

    const rachaElemento =
        document.getElementById(
            "topbarRacha"
        );


    if (rachaElemento) {

        rachaElemento.textContent =
            usuario.racha ?? 0;
    }


    /* =====================================================
       AVATAR
       ===================================================== */

    const imagen =
        document.getElementById(
            "usuarioAvatarImg"
        );


    const inicialElemento =
        document.getElementById(
            "usuarioAvatarInicial"
        );


    if (
        imagen &&
        inicialElemento
    ) {

        colocarFotoOInicial(
            imagen,
            inicialElemento,
            usuario
        );

        const contenedorAvatar =
            imagen.parentElement;

        aplicarMarcoPerfil(
            contenedorAvatar,
            usuario.marco_perfil
        );
    }
}


/* =========================================================
   MINIMIZAR / MAXIMIZAR SIDEBAR
   ========================================================= */

function toggleSidebar() {

    const container =
        document.getElementById(
            "dashboardContainer"
        );


    const boton =
        document.getElementById(
            "btnMenu"
        );


    if (!container) {

        return;
    }


    container.classList.toggle(
        "sidebar-colapsada"
    );


    const estaColapsado =
        container.classList.contains(
            "sidebar-colapsada"
        );


    localStorage.setItem(

        "sidebarColapsado",

        estaColapsado
            ? "true"
            : "false"

    );


    if (boton) {

        boton.title =
            estaColapsado

                ? "Maximizar menú"

                : "Minimizar menú";
    }
}


/* =========================================================
   RECUPERAR ESTADO SIDEBAR
   ========================================================= */

function cargarEstadoSidebar() {

    const container =
        document.getElementById(
            "dashboardContainer"
        );


    const boton =
        document.getElementById(
            "btnMenu"
        );


    if (!container) {

        return;
    }


    const guardado =
        localStorage.getItem(
            "sidebarColapsado"
        );


    if (guardado === "true") {

        container.classList.add(
            "sidebar-colapsada"
        );


        if (boton) {

            boton.title =
                "Maximizar menú";
        }
    }
}


/* =========================================================
   TEMA CLARO / OSCURO
   ========================================================= */

function cargarTemaYachayPlay() {

    const temaGuardado =
        localStorage.getItem(
            "temaYachayPlay"
        );


    if (
        temaGuardado ===
        "oscuro"
    ) {

        document.body.classList.add(
            "modo-oscuro"
        );

    } else {

        document.body.classList.remove(
            "modo-oscuro"
        );
    }
}


/* =========================================================
   CAMBIAR MODO OSCURO
   ========================================================= */

function cambiarModoOscuro(
    checkbox
) {

    if (checkbox.checked) {

        document.body.classList.add(
            "modo-oscuro"
        );


        localStorage.setItem(
            "temaYachayPlay",
            "oscuro"
        );


    } else {

        document.body.classList.remove(
            "modo-oscuro"
        );


        localStorage.setItem(
            "temaYachayPlay",
            "claro"
        );
    }


    const texto =
        document.getElementById(
            "estadoModoOscuro"
        );


    if (texto) {

        texto.textContent =
            checkbox.checked

                ? "Activado"

                : "Desactivado";
    }
}

function obtenerUrlFotoPerfil(fotoPerfil) {

    if (!fotoPerfil) {

        return null;
    }


    /* =====================================================
       FOTO DE GOOGLE / URL EXTERNA
       ===================================================== */

    if (
        fotoPerfil.startsWith("http://") ||
        fotoPerfil.startsWith("https://")
    ) {

        return fotoPerfil;
    }


    /* =====================================================
       FOTO SUBIDA A YACHAYPLAY
       ===================================================== */

    if (
        fotoPerfil.startsWith("/")
    ) {

        return `${window.location.origin}${fotoPerfil}`;
    }


    return `${window.location.origin}/${fotoPerfil}`;
}

/* =========================================================
   MOSTRAR PERFIL
   ========================================================= */

function mostrarPerfil() {

    configurarBotonRegresar(
        null
    );


    cambiarActivo(
        "Perfil"
    );


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Mi perfil";


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


    /* =====================================================
       INICIAL DEL USUARIO
       ===================================================== */

    const inicial =

        (
            usuario.nombre ||
            "U"
        )

        .trim()

        .charAt(0)

        .toUpperCase();


    /* =====================================================
       MOSTRAR PERFIL
       ===================================================== */

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="perfil-dashboard">


            <!-- ==========================================
                 FOTO DE PERFIL
                 ========================================== -->

            <div class="perfil-avatar-contenedor">


                <div
                    class="perfil-avatar-grande"
                >


                    <img
                        id="perfilFotoImg"
                        class="perfil-avatar-imagen"
                        alt="Foto de perfil"
                    >


                    <span
                        id="perfilFotoInicial"
                    >

                        ${inicial}

                    </span>


                </div>


                <button
                    class="btn-foto-flotante"

                    onclick="
                        document
                        .getElementById('inputFotoPerfil')
                        .click()
                    "

                    title="Cambiar foto"

                    type="button"
                >

                    📷

                </button>


            </div>



            <!-- ==========================================
                 INFORMACIÓN DEL USUARIO
                 ========================================== -->

            <h1>

                ${usuario.nombre || "Usuario"}
                ${usuario.apellido || ""}

            </h1>


            <p class="perfil-correo">

                ${usuario.correo || ""}

            </p>



            <!-- ==========================================
                 INPUT DE FOTO
                 ========================================== -->

            <input
                type="file"

                id="inputFotoPerfil"

                accept="
                    image/jpeg,
                    image/png,
                    image/webp
                "

                onchange="
                    previsualizarFotoPerfil(event)
                "

                hidden
            >



            <!-- ==========================================
                 ACCIONES DE FOTO
                 ========================================== -->

            <div class="acciones-foto-perfil">


                <button
                    class="btn-nivel"

                    type="button"

                    onclick="
                        document
                        .getElementById('inputFotoPerfil')
                        .click()
                    "
                >

                    📷 Cambiar foto

                </button>



                <button
                    class="btn-eliminar-foto"

                    type="button"

                    onclick="
                        eliminarFotoPerfil()
                    "

                    ${
                        usuario.foto_perfil

                            ? ""

                            : "disabled"
                    }
                >

                    🗑️ Eliminar foto

                </button>


            </div>



            <p
                id="mensajeFotoPerfil"

                class="mensaje-foto-perfil"
            >

                JPG, PNG o WEBP · máximo 2 MB

            </p>



            <!-- ==========================================
                 ESTADÍSTICAS
                 ========================================== -->

            <div class="stats perfil-stats">


                <div class="stat-card">

                    <h3>
                        ⭐ Nivel
                    </h3>

                    <p>
                        ${usuario.nivel ?? 1}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>
                        ⚡ XP
                    </h3>

                    <p>
                        ${usuario.xp ?? 0}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>
                        🪙 Monedas
                    </h3>

                    <p>
                        ${usuario.monedas ?? 0}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>
                        🔥 Racha
                    </h3>

                    <p>
                        ${usuario.racha ?? 0}
                    </p>

                </div>


            </div>


        </div>
    `;


    /* =====================================================
       COLOCAR FOTO O INICIAL
       ===================================================== */

    const imagenPerfil =
        document.getElementById(
            "perfilFotoImg"
        );


    const inicialPerfil =
        document.getElementById(
            "perfilFotoInicial"
        );


    colocarFotoOInicial(

        imagenPerfil,

        inicialPerfil,

        usuario

    );


    /* =====================================================
       APLICAR MARCO EQUIPADO
       ===================================================== */

    const avatarGrande =
        document.querySelector(
            ".perfil-avatar-grande"
        );


    aplicarMarcoPerfil(

        avatarGrande,

        usuario.marco_perfil

    );


    /* =====================================================
       ACTUALIZAR TOPBAR
       ===================================================== */

    actualizarTopbarUsuario();
}


/* =========================================================
   PREVISUALIZAR FOTO
   ========================================================= */

async function previsualizarFotoPerfil(
    event
) {

    const archivo =
        event.target.files[0];


    if (!archivo) {

        return;
    }


    const formatosPermitidos = [

        "image/jpeg",
        "image/png",
        "image/webp"

    ];


    if (
        !formatosPermitidos.includes(
            archivo.type
        )
    ) {
        event.target.value =
            "";
        return;
    }


    /*
    2 MB máximo
    */

    if (
        archivo.size >
        2 * 1024 * 1024
    ) {
        event.target.value =
            "";
        return;
    }


    fotoPerfilSeleccionada =
        archivo;


    if (urlPreviewFotoPerfil) {

        URL.revokeObjectURL(
            urlPreviewFotoPerfil
        );
    }


    urlPreviewFotoPerfil =
        URL.createObjectURL(
            archivo
        );


    const imagen =
        document.getElementById(
            "perfilFotoImg"
        );


    const inicial =
        document.getElementById(
            "perfilFotoInicial"
        );


    if (imagen) {

        imagen.src =
            urlPreviewFotoPerfil;


        imagen.hidden =
            false;
    }


    if (inicial) {

        inicial.hidden =
            true;
    }


    /* =========================================================
        MOSTRAR ESTADO
        ========================================================= */

    const mensaje =
        document.getElementById(
            "mensajeFotoPerfil"
        );


    if (mensaje) {

        mensaje.textContent =
            "⏳ Guardando foto...";
    }


    /* =========================================================
        GUARDAR AUTOMÁTICAMENTE
        ========================================================= */

    await guardarFotoPerfil();
}


/* =========================================================
   GUARDAR FOTO
   ========================================================= */

async function guardarFotoPerfil() {

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


    /* =====================================================
       VALIDAR QUE HAYA UNA FOTO SELECCIONADA
       ===================================================== */

    if (!fotoPerfilSeleccionada) {

        return;
    }


    const mensaje =
        document.getElementById(
            "mensajeFotoPerfil"
        );


    try {

        /* =================================================
           MOSTRAR ESTADO
           ================================================= */

        if (mensaje) {

            mensaje.textContent =
                "⏳ Guardando foto...";
        }


        /* =================================================
           PREPARAR ARCHIVO
           ================================================= */

        const formData =
            new FormData();


        formData.append(
            "foto",
            fotoPerfilSeleccionada
        );


        /* =================================================
           ENVIAR AL SERVIDOR
           ================================================= */

        const respuesta =
            await fetch(

                `${API_DASHBOARD}/perfil/foto`,

                {

                    method:
                        "POST",

                    credentials:
                        "include",

                    body:
                        formData

                }

            );


        const data =
            await respuesta.json();


        /* =================================================
           VALIDAR RESPUESTA
           ================================================= */

        if (!respuesta.ok) {

            throw new Error(

                data.mensaje ||
                "No se pudo guardar la foto"

            );
        }


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
           LIMPIAR FOTO TEMPORAL
           ================================================= */

        fotoPerfilSeleccionada =
            null;


        /* =================================================
           ACTUALIZAR FOTO DEL PERFIL
           ================================================= */

        const imagenPerfil =
            document.getElementById(
                "perfilFotoImg"
            );


        const inicialPerfil =
            document.getElementById(
                "perfilFotoInicial"
            );


        colocarFotoOInicial(

            imagenPerfil,

            inicialPerfil,

            data.usuario

        );


        /* =================================================
           HABILITAR BOTÓN ELIMINAR
           ================================================= */

        const botonEliminar =
            document.querySelector(
                ".btn-eliminar-foto"
            );


        if (botonEliminar) {

            botonEliminar.disabled =
                false;
        }


        /* =================================================
           ACTUALIZAR TOPBAR
           ================================================= */

        actualizarTopbarUsuario();


        /* =================================================
           MENSAJE DE ÉXITO
           ================================================= */

        if (mensaje) {

            mensaje.textContent =
                "✅ Foto de perfil actualizada correctamente.";
        }


        /* =================================================
           LIMPIAR INPUT

           Permite seleccionar nuevamente la misma foto.
           ================================================= */

        const input =
            document.getElementById(
                "inputFotoPerfil"
            );


        if (input) {

            input.value =
                "";
        }


    } catch (error) {

        console.error(
            "Error guardando foto:",
            error
        );


        if (mensaje) {

            mensaje.textContent =
                `❌ ${error.message}`;
        }
    }
}


/* =========================================================
   ELIMINAR FOTO
   ========================================================= */

async function eliminarFotoPerfil() {

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


    if (!usuario.foto_perfil) {

        return;
    }

    try {

        const respuesta =
            await fetch(

                `${API_DASHBOARD}/perfil/foto/${usuario.id}`,

                {
                    method:
                        "DELETE"
                }

            );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                data.mensaje ||
                "No se pudo eliminar la foto"
            );
        }


        /* =====================================================
           FORZAR FOTO COMO NULL
           ===================================================== */

        data.usuario.foto_perfil =
            null;


        /* =====================================================
           ACTUALIZAR LOCALSTORAGE
           ===================================================== */

        localStorage.setItem(

            "usuario",

            JSON.stringify(
                data.usuario
            )

        );


        /*
        IMPORTANTE:

        Primero actualizamos el encabezado
        para que desaparezca la fotografía
        y aparezca inmediatamente la inicial.
        */

        actualizarTopbarUsuario();


        /*
        Luego recargamos el apartado Perfil.
        */

        mostrarPerfil();


    } catch (error) {


        console.error(
            "Error eliminando foto:",
            error
        );
    }
}

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

function mostrarConfiguracion() {
    
    configurarBotonRegresar(
        null
    );

    cambiarActivo(
        "Configuración"
    );


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Configuración";


    const modoOscuro =
        document.body.classList.contains(
            "modo-oscuro"
        );


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="configuracion-dashboard">


            <div class="config-header">

                <div>

                    <h1>
                        ⚙️ Configuración
                    </h1>

                    <p>
                        Personaliza tu experiencia
                        en YachayPlay.
                    </p>

                </div>

            </div>



            <!-- ==========================================
                 APARIENCIA
                 ========================================== -->

            <div class="config-seccion-titulo">

                Apariencia

            </div>


            <div class="config-item">


                <div class="config-item-info">


                    <div class="config-icono">

                        ${
                            modoOscuro
                                ? "🌙"
                                : "☀️"
                        }

                    </div>


                    <div>

                        <h3>
                            Modo oscuro
                        </h3>

                        <p>
                            Reduce el brillo y utiliza
                            colores oscuros en la interfaz.
                        </p>

                        <span
                            class="estado-config"
                            id="estadoModoOscuro"
                        >

                            ${
                                modoOscuro
                                    ? "Activado"
                                    : "Desactivado"
                            }

                        </span>

                    </div>


                </div>



                <label
                    class="interruptor"
                    title="Activar modo oscuro"
                >

                    <input
                        type="checkbox"

                        onchange="
                            cambiarModoOscuro(this)
                        "

                        ${
                            modoOscuro
                                ? "checked"
                                : ""
                        }
                    >

                    <span
                        class="interruptor-slider"
                    >
                    </span>

                </label>


            </div>



            <!-- ==========================================
                 MENÚ
                 ========================================== -->

            <div class="config-seccion-titulo">

                Navegación

            </div>


            <div class="config-item">


                <div class="config-item-info">


                    <div class="config-icono">

                        ☰

                    </div>


                    <div>

                        <h3>
                            Menú lateral
                        </h3>

                        <p>
                            Minimiza o maximiza el menú
                            lateral del dashboard.
                        </p>

                    </div>


                </div>


                <button
                    class="btn-config"
                    onclick="toggleSidebar()"
                >

                    Cambiar tamaño

                </button>


            </div>



            <!-- ==========================================
                 CUENTA
                 ========================================== -->

            <div class="config-seccion-titulo">

                Cuenta

            </div>


            <div class="config-item">


                <div class="config-item-info">


                    <div class="config-icono">

                        👤

                    </div>


                    <div>

                        <h3>
                            Foto de perfil
                        </h3>

                        <p>
                            Cambia la imagen que aparece
                            en tu cuenta.
                        </p>

                    </div>


                </div>


                <button
                    class="btn-config"
                    onclick="mostrarPerfil()"
                >

                    Administrar

                </button>


            </div>


            <div class="config-item config-item-peligro">


                <div class="config-item-info">


                    <div class="config-icono">

                        🚪

                    </div>


                    <div>

                        <h3>
                            Cerrar sesión
                        </h3>

                        <p>
                            Sal de tu cuenta actual
                            de YachayPlay.
                        </p>

                    </div>


                </div>


                <button
                    class="btn-cerrar-sesion"
                    onclick="cerrarSesion()"
                >

                    Cerrar sesión

                </button>


            </div>


        </div>
    `;
}

/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

async function cerrarSesion() {

    const confirmar =
        await confirmarYachay({

            tipo:
                "logout",

            titulo:
                "¿Cerrar sesión?",

            mensaje:
                "¿Seguro que deseas salir de YachayPlay?\nTu progreso ya guardado no se perderá.",

            textoConfirmar:
                "Cerrar sesión",

            textoCancelar:
                "Seguir aprendiendo"

        });


    if (!confirmar) {

        return;
    }


    try {

        await fetch(

            "/logout",

            {

                method:
                    "POST",

                credentials:
                    "include"

            }

        );


    } catch (error) {

        console.error(
            "Error cerrando sesión:",
            error
        );

    } finally {

        localStorage.removeItem(
            "usuario"
        );


        window.location.href =
            "login.html";
    }
}

/* =========================================================
   MARCOS DE PERFIL
   ========================================================= */

const CLASES_MARCOS_PERFIL = [

    "marco_yachay",
    "marco_fuego",
    "marco_dorado",
    "marco_kuntur"

];


function aplicarMarcoPerfil(
    elemento,
    marco
) {

    if (!elemento) {
        return;
    }


    elemento.classList.remove(
        ...CLASES_MARCOS_PERFIL
    );


    if (
        marco &&
        marco !== "ninguno" &&
        CLASES_MARCOS_PERFIL.includes(
            marco
        )
    ) {

        elemento.classList.add(
            marco
        );
    }
}

/* =========================================================
   INICIALIZAR DASHBOARD
   ========================================================= */

function inicializarInterfazDashboard() {

    /*
    Primero aplicar tema para evitar
    que la página permanezca en claro.
    */

    cargarTemaYachayPlay();


    cargarEstadoSidebar();


    actualizarTopbarUsuario();
}