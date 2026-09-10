/* =========================================================
   YACHAYPLAY - TIENDA
   ========================================================= */

async function mostrarTienda() {

    configurarBotonRegresar(
        null
    );


    cambiarActivo(
        "Tienda"
    );


    document.getElementById(
        "tituloPagina"
    ).textContent =
        "Tienda";


    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="tienda-cargando">

            🛒 Cargando tienda...

        </div>
    `;


    try {

        const respuesta =
            await fetch(

                "/tienda",

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
                "No se pudo cargar la tienda"
            );
        }


        renderizarTienda(
            data
        );


    } catch (error) {

        console.error(
            "Error cargando tienda:",
            error
        );


        document.getElementById(
            "contenido"
        ).innerHTML = `

            <div class="tienda-error">

                No se pudo cargar la tienda.

            </div>
        `;
    }
}


/* =========================================================
   RENDERIZAR
   ========================================================= */

function renderizarTienda(
    data
) {

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="tienda-pagina">


            <div class="tienda-header">


                <div>

                    <h1>
                        🛒 Tienda YachayPlay
                    </h1>


                    <p>
                        Personaliza tu perfil
                        utilizando las monedas
                        que consigues aprendiendo.
                    </p>

                </div>


                <div class="tienda-monedas">

                    🪙 ${data.monedas}

                </div>


            </div>



            <div class="tienda-seccion-titulo">

                Marcos de perfil

            </div>



            <div class="tienda-grid">


                ${data.articulos
                    .map(
                        articulo =>
                            crearTarjetaTienda(
                                articulo,
                                data.monedas
                            )
                    )
                    .join("")}


            </div>



            ${
                data.marco_equipado !==
                "ninguno"

                    ? `

                        <div class="tienda-quitar-marco">

                            <button
                                class="btn-quitar-marco"
                                onclick="
                                    equiparMarcoTienda(
                                        'ninguno'
                                    )
                                "
                            >

                                Quitar marco actual

                            </button>

                        </div>

                    `

                    : ""
            }


        </div>
    `;
}

/* =========================================================
   PREVIEW DEL AVATAR DEL USUARIO
   ========================================================= */

function crearPreviewAvatarTienda() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuario"
            )
        );


    const inicial =

        usuario?.nombre

            ? usuario.nombre
                .trim()
                .charAt(0)
                .toUpperCase()

            : "Y";


    if (!usuario) {

        return `

            <div class="tienda-avatar-preview">

                <span class="tienda-avatar-inicial">

                    ${inicial}

                </span>

            </div>
        `;
    }


    const foto =
        obtenerUrlFotoPerfil(
            usuario.foto_perfil
        );


    /* =====================================================
       SIN FOTO
       ===================================================== */

    if (!foto) {

        return `

            <div class="tienda-avatar-preview">

                <span class="tienda-avatar-inicial">

                    ${inicial}

                </span>

            </div>
        `;
    }


    /* =====================================================
       CON FOTO + FALLBACK A INICIAL
       ===================================================== */

    return `

        <div class="tienda-avatar-preview">


            <span
                class="tienda-avatar-inicial"
                style="display:none;"
            >

                ${inicial}

            </span>


            <img
                src="${foto}"

                alt="Foto de perfil"

                class="tienda-avatar-imagen"

                onerror="
                    this.style.display='none';
                    this.previousElementSibling.style.display='flex';
                "
            >


        </div>
    `;
}

/* =========================================================
   TARJETA
   ========================================================= */

function crearTarjetaTienda(
    articulo,
    monedasUsuario
) {

    let boton = "";


    /* EQUIPADO */

    if (articulo.equipado) {

        boton = `

            <button
                class="btn-tienda-equipado"
                disabled
            >

                ✓ Equipado

            </button>
        `;


    /* COMPRADO */

    } else if (
        articulo.comprado
    ) {

        boton = `

            <button
                class="btn-tienda-equipar"

                onclick="
                    equiparMarcoTienda(
                        '${articulo.id}'
                    )
                "
            >

                Equipar

            </button>
        `;


    /* NO TIENE MONEDAS */

    } else if (
        monedasUsuario <
        articulo.precio
    ) {

        boton = `

            <button
                class="btn-tienda-sin-monedas"
                disabled
            >

                🪙 ${articulo.precio}

            </button>
        `;


    /* PUEDE COMPRAR */

    } else {

        boton = `

            <button
                class="btn-tienda-comprar"

                onclick="
                    comprarArticuloTienda(
                        '${articulo.id}',
                        ${articulo.precio},
                        this
                    )
                "
            >

                Comprar · 🪙 ${articulo.precio}

            </button>
        `;
    }


    return `

        <div class="
            tienda-card
            ${articulo.equipado
                ? "tienda-card-equipado"
                : ""}
        ">


            <div class="
                tienda-preview-marco
                ${articulo.id}
            ">

                ${crearPreviewAvatarTienda()}

            </div>

            ${
                articulo.equipado

                    ? `

                        <div class="tienda-equipado-badge">

                            ✓ En uso

                        </div>

                    `

                    : ""
            }

            <h2>
                ${articulo.nombre}
            </h2>


            <p>
                ${articulo.descripcion}
            </p>


            ${
                articulo.comprado

                    ? `

                        <span class="tienda-comprado">

                            ✓ Comprado

                        </span>

                    `

                    : `

                        <span class="tienda-precio">

                            🪙 ${articulo.precio}

                        </span>

                    `
            }


            ${boton}


        </div>
    `;
}


/* =========================================================
   COMPRAR
   ========================================================= */

async function comprarArticuloTienda(
    articuloId,
    precio,
    boton
) {

    try {

        const respuesta =
            await fetch(

                "/tienda/comprar",

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

                            articulo_id:
                                articuloId

                        })

                }

            );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {

            return;
        }


        localStorage.setItem(

            "usuario",

            JSON.stringify(
                data.usuario
            )

        );


        actualizarTopbarUsuario();

        celebrarCompraYachay(

            boton,

            "¡Compra realizada!",

            `${data.articulo.nombre}\nYa forma parte de tu colección.`

        );

        mostrarLogrosNuevos(
            data.logros_nuevos
        );

        mostrarTienda();


    } catch (error) {

        console.error(
            "Error comprando:",
            error
        );

    }
}


/* =========================================================
   EQUIPAR
   ========================================================= */

async function equiparMarcoTienda(
    marcoId
) {

    try {

        const respuesta =
            await fetch(

                "/tienda/equipar",

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

                            marco_id:
                                marcoId

                        })

                }

            );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {

            return;
        }


        localStorage.setItem(

            "usuario",

            JSON.stringify(
                data.usuario
            )

        );


        actualizarTopbarUsuario();


        mostrarTienda();


    } catch (error) {

        console.error(
            "Error equipando marco:",
            error
        );

    }
}