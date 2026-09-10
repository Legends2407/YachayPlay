const express = require("express");
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");



const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const helmet =
    require("helmet");


const rateLimit =
    require("express-rate-limit");

const crypto =
    require("crypto");


const { OAuth2Client } = require("google-auth-library");

const app = express();

/* =========================================================
   RAILWAY / PROXY
   ========================================================= */

app.set(
    "trust proxy",
    1
);


/* =========================================================
   HEADERS DE SEGURIDAD
   ========================================================= */

app.use(

    helmet({

        /* =================================================
           YACHAYPLAY todavía usa onclick inline
           y Google Identity Services
           ================================================= */

        contentSecurityPolicy:
            false,


        /* =================================================
           PERMITIR POPUPS DE GOOGLE LOGIN

           Helmet usa "same-origin" por defecto,
           pero Google Sign-In necesita conservar
           comunicación con la ventana emergente.
           ================================================= */

        crossOriginOpenerPolicy: {

            policy:
                "same-origin-allow-popups"

        }

    })

);

/* =========================================================
   PROTECCIÓN DE AUTENTICACIÓN
   ========================================================= */

const limiteAutenticacion =
    rateLimit({

        windowMs:
            15 * 60 * 1000,

        max:
            20,

        standardHeaders:
            true,

        legacyHeaders:
            false,

        message: {

            mensaje:
                "Demasiados intentos. Espera unos minutos e inténtalo nuevamente."

        }

    });

/* =========================================================
   CORREO PARA RECUPERACIÓN
   ========================================================= */
const APP_URL =
    process.env.APP_URL ||
    "http://localhost:3000";

/* =========================================================
   ENVIAR CORREO DE RECUPERACIÓN CON BREVO
   ========================================================= */

async function enviarCorreoRecuperacion(
    usuario,
    enlace
) {

    const respuesta =
        await fetch(

            "https://api.brevo.com/v3/smtp/email",

            {

                method:
                    "POST",

                headers: {

                    "accept":
                        "application/json",

                    "api-key":
                        process.env.BREVO_API_KEY,

                    "content-type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        sender: {

                            name:
                                "YachayPlay",

                            email:
                                process.env.BREVO_SENDER_EMAIL

                        },


                        to: [

                            {

                                email:
                                    usuario.correo,

                                name:
                                    usuario.nombre ||
                                    "Estudiante"

                            }

                        ],


                        subject:
                            "Recupera tu contraseña de YachayPlay",


                        htmlContent: `

                            <div
                                style="
                                    font-family:Arial,sans-serif;
                                    max-width:550px;
                                    margin:auto;
                                    padding:25px;
                                "
                            >

                                <h2
                                    style="
                                        color:#6b0fa8;
                                    "
                                >
                                    🦅 YachayPlay
                                </h2>


                                <p>
                                    Hola ${usuario.nombre || "estudiante"},
                                </p>


                                <p>
                                    Recibimos una solicitud para
                                    cambiar tu contraseña de YachayPlay.
                                </p>


                                <p>
                                    Este enlace estará disponible
                                    durante 30 minutos.
                                </p>


                                <a
                                    href="${enlace}"

                                    style="
                                        display:inline-block;
                                        margin:15px 0;
                                        padding:12px 20px;
                                        background:#8A2BE2;
                                        color:white;
                                        text-decoration:none;
                                        border-radius:10px;
                                        font-weight:bold;
                                    "
                                >

                                    Cambiar contraseña

                                </a>


                                <p
                                    style="
                                        color:#777;
                                        font-size:13px;
                                    "
                                >

                                    Si tú no solicitaste este cambio,
                                    puedes ignorar este correo.

                                </p>

                            </div>
                        `

                    })

            }

        );


    /* =====================================================
       VALIDAR RESPUESTA DE BREVO
       ===================================================== */

    if (!respuesta.ok) {

        const detalleError =
            await respuesta.text();


        console.error(
            "Error enviando correo con Brevo:",
            respuesta.status,
            detalleError
        );


        throw new Error(
            "No se pudo enviar el correo de recuperación."
        );
    }


    const data =
        await respuesta.json();


    console.log(
        "Correo de recuperación enviado:",
        data.messageId
    );


    return data;
}

/* =========================================================
   AUTENTICACIÓN JWT
   ========================================================= */

const JWT_SECRET =
    process.env.JWT_SECRET;


const NOMBRE_COOKIE =
    "yachay_session";


/* =========================================================
   VALIDAR CONFIGURACIÓN
   ========================================================= */

if (
    !JWT_SECRET ||
    JWT_SECRET.length < 32
) {

    throw new Error(
        "JWT_SECRET no está configurado correctamente en .env"
    );
}


/* =========================================================
   OPCIONES DE COOKIE
   ========================================================= */

function opcionesCookieSesion() {

    return {

        httpOnly: true,

        /*
        Evita que JavaScript pueda leer
        el token mediante document.cookie.
        */

        sameSite: "lax",

        /*
        En localhost usamos HTTP.

        En producción deberá utilizar HTTPS.
        */

        secure:
            process.env.NODE_ENV ===
            "production",

        path: "/"

    };
}


/* =========================================================
   CREAR TOKEN
   ========================================================= */

function crearTokenSesion(usuario) {

    return jwt.sign(

        {
            sub:
                String(usuario.id)
        },

        JWT_SECRET,

        {
            expiresIn:
                "7d",

            issuer:
                "yachayplay",

            audience:
                "yachayplay-web"
        }

    );
}


/* =========================================================
   CREAR COOKIE DE SESIÓN
   ========================================================= */

function crearCookieSesion(
    res,
    usuario
) {

    const token =
        crearTokenSesion(
            usuario
        );


    res.cookie(

        NOMBRE_COOKIE,

        token,

        {

            ...opcionesCookieSesion(),

            maxAge:
                7 *
                24 *
                60 *
                60 *
                1000

        }

    );
}


/* =========================================================
   ELIMINAR COOKIE
   ========================================================= */

function eliminarCookieSesion(
    res
) {

    res.clearCookie(

        NOMBRE_COOKIE,

        opcionesCookieSesion()

    );
}


/* =========================================================
   MIDDLEWARE DE AUTENTICACIÓN
   ========================================================= */

function autenticarUsuario(
    req,
    res,
    next
) {

    const token =
        req.cookies[
            NOMBRE_COOKIE
        ];


    if (!token) {

        return res
            .status(401)
            .json({

                mensaje:
                    "Debes iniciar sesión"

            });
    }


    try {

        const payload =
            jwt.verify(

                token,

                JWT_SECRET,

                {
                    issuer:
                        "yachayplay",

                    audience:
                        "yachayplay-web"
                }

            );


        const usuarioId =
            Number(
                payload.sub
            );


        if (!usuarioId) {

            throw new Error(
                "Token inválido"
            );
        }


        /*
        Desde ahora esta es la identidad
        confiable del usuario.
        */

        req.usuario = {

            id:
                usuarioId

        };


        next();


    } catch (error) {

        eliminarCookieSesion(
            res
        );


        return res
            .status(401)
            .json({

                mensaje:
                    "La sesión expiró. Inicia sesión nuevamente."

            });
    }
}

/* =========================================================
   SEGURIDAD DE USUARIOS
   ========================================================= */

const SALT_ROUNDS = 10;


/* =========================================================
   SABER SI UNA CONTRASEÑA YA USA BCRYPT
   ========================================================= */

function esHashBcrypt(valor) {

    if (
        typeof valor !== "string"
    ) {

        return false;
    }


    return /^\$2[aby]\$\d{2}\$/.test(
        valor
    );
}


/* =========================================================
   ELIMINAR DATOS PRIVADOS ANTES DE ENVIAR AL NAVEGADOR
   ========================================================= */

function usuarioSeguro(usuario) {

    if (!usuario) {

        return null;
    }


    const {

        password_hash,
        google_id,

        ...datosPublicos

    } = usuario;


    return datosPublicos;
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "262264226216-2m3l1a3leo6v0qdo1keqsd7vs2qqt8j1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

/* =========================================================
   ARCHIVOS PÚBLICOS DEL FRONTEND
   ========================================================= */

app.use(

    express.static(
        path.join(
            __dirname,
            "public"
        )
    )

);


/* =========================================================
   FOTOS DE PERFIL
   ========================================================= */

app.use(

    "/uploads",

    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )

);

/* =========================================================
   CONFIGURACIÓN DE ARCHIVOS Y MULTER
   ========================================================= */

const CARPETA_FOTOS_PERFIL = path.join(__dirname, "uploads", "perfiles");

if (!fs.existsSync(CARPETA_FOTOS_PERFIL)) {
    fs.mkdirSync(CARPETA_FOTOS_PERFIL, { recursive: true });
}

const almacenamientoFotos = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, CARPETA_FOTOS_PERFIL);
    },
    filename: function (req, file, cb) {
        let extension = ".jpg";
        if (file.mimetype === "image/png") extension = ".png";
        else if (file.mimetype === "image/webp") extension = ".webp";
        else if (file.mimetype === "image/jpeg") extension = ".jpg";

        const nombreArchivo = `perfil-${Date.now()}-${Math.round(Math.random() * 1000000)}${extension}`;
        cb(null, nombreArchivo);
    }
});

const subirFotoPerfil = multer({
    storage: almacenamientoFotos,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: function (req, file, cb) {
        const permitidos = ["image/jpeg", "image/png", "image/webp"];
        if (permitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP."));
        }
    }
});

async function eliminarArchivoFotoPerfil(rutaFoto) {
    if (!rutaFoto || !rutaFoto.startsWith("/uploads/perfiles/")) return;

    const nombreArchivo = path.basename(rutaFoto);
    const rutaFisica = path.join(CARPETA_FOTOS_PERFIL, nombreArchivo);

    try {
        if (fs.existsSync(rutaFisica)) {
            await fs.promises.unlink(rutaFisica);
        }
    } catch (error) {
        console.error("No se pudo eliminar la foto anterior:", error);
    }
}

/* =========================================================
   ACTUALIZAR NIVEL DEL USUARIO

   "db" puede ser:
   - pool normalmente
   - una transacción durante guardar-leccion
   ========================================================= */

async function actualizarNivelUsuario(
    usuario_id,
    db = pool
) {

    try {

        const resultado =
            await db.query(

                `
                SELECT
                    COALESCE(
                        MAX(nivel),
                        1
                    ) AS nivel_maximo

                FROM niveles_desbloqueados

                WHERE usuario_id = $1
                `,

                [
                    usuario_id
                ]

            );


        const nuevoNivel =
            Number(
                resultado.rows[0].nivel_maximo
            );


        const usuarioActualizado =
            await db.query(

                `
                UPDATE usuarios

                SET nivel = $1

                WHERE id = $2

                RETURNING *
                `,

                [
                    nuevoNivel,
                    usuario_id
                ]

            );


        return usuarioActualizado.rows[0];


    } catch (error) {

        console.error(
            "Error actualizando nivel:",
            error
        );

        throw error;
    }
}

/* =========================================================
   ENDPOINTS DE RUTAS
   ========================================================= */

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error de conexión" });
    }
});

/* =========================================================
   REGISTRO
   ========================================================= */

app.post(
    "/register",

    limiteAutenticacion,

    async (req, res) => {

        try {

            const {
                nombre,
                apellido,
                correo,
                password
            } = req.body;


            /* =============================================
               LIMPIAR DATOS
               ============================================= */

            const nombreLimpio =
                String(
                    nombre || ""
                ).trim();


            const apellidoLimpio =
                String(
                    apellido || ""
                ).trim();


            const correoLimpio =
                String(
                    correo || ""
                )
                .trim()
                .toLowerCase();


            /* =============================================
               VALIDAR
               ============================================= */

            if (
                !nombreLimpio ||
                !correoLimpio ||
                !password
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Completa todos los campos obligatorios"

                    });
            }


            /* =============================================
               COMPROBAR CORREO
               ============================================= */

            const usuarioExistente =
                await pool.query(

                    `
                    SELECT id

                    FROM usuarios

                    WHERE LOWER(correo) =
                          LOWER($1)
                    `,

                    [
                        correoLimpio
                    ]

                );


            if (
                usuarioExistente.rows.length > 0
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "El correo ya está registrado"

                    });
            }


            /* =============================================
               CREAR HASH
               ============================================= */

            const passwordHash =
                await bcrypt.hash(
                    password,
                    SALT_ROUNDS
                );


            /* =============================================
               CREAR USUARIO
               ============================================= */

            const resultado =
                await pool.query(

                    `
                    INSERT INTO usuarios
                    (
                        nombre,
                        apellido,
                        correo,
                        password_hash
                    )

                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4
                    )

                    RETURNING *
                    `,

                    [
                        nombreLimpio,
                        apellidoLimpio,
                        correoLimpio,
                        passwordHash
                    ]

                );


            /* =============================================
               RESPUESTA SEGURA
               ============================================= */

            res
                .status(201)
                .json({

                    mensaje:
                        "Usuario creado correctamente",

                    usuario:
                        usuarioSeguro(resultado.rows[0])

                });


        } catch (error) {

            console.error(
                "Error en registro:",
                error
            );


            res
                .status(500)
                .json({

                    mensaje:
                        "Error al registrar usuario"

                });
        }
    }
);

/* =========================================================
   SOLICITAR RECUPERACIÓN DE CONTRASEÑA
   ========================================================= */

app.post(
    "/forgot-password",

    limiteAutenticacion,

    async (req, res) => {

        try {

            const correo =
                String(
                    req.body.correo || ""
                )
                .trim()
                .toLowerCase();


            if (!correo) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Ingresa tu correo electrónico."

                    });
            }


            const resultado =
                await pool.query(

                    `
                    SELECT
                        id,
                        nombre,
                        correo,
                        password_hash

                    FROM usuarios

                    WHERE LOWER(correo) =
                          LOWER($1)
                    `,

                    [
                        correo
                    ]

                );


            /*
            Importante:
            devolvemos el mismo mensaje aunque
            la cuenta no exista.
            */

            if (
                resultado.rows.length === 0
            ) {

                return res.json({

                    mensaje:
                        "Si existe una cuenta con ese correo, recibirás un enlace para cambiar tu contraseña."

                });
            }


            const usuario =
                resultado.rows[0];


            /*
            Cuenta creada únicamente con Google.
            No tiene contraseña local.
            */

            if (
                !usuario.password_hash
            ) {

                return res.json({

                    mensaje:
                        "Si existe una cuenta con ese correo, recibirás un enlace para cambiar tu contraseña."

                });
            }


            /* =============================================
               TOKEN ALEATORIO
               ============================================= */

            const token =
                crypto
                    .randomBytes(32)
                    .toString("hex");


            /*
            Nunca guardamos el token real
            en PostgreSQL.
            */

            const tokenHash =
                crypto
                    .createHash("sha256")
                    .update(token)
                    .digest("hex");


            const expiracion =
                new Date(
                    Date.now() +
                    30 * 60 * 1000
                );


            await pool.query(

                `
                UPDATE usuarios

                SET
                    password_reset_token_hash = $1,
                    password_reset_expires_at = $2

                WHERE id = $3
                `,

                [
                    tokenHash,
                    expiracion,
                    usuario.id
                ]

            );


            const enlace =
                `${APP_URL}/reset-password.html?token=${encodeURIComponent(token)}`;


            /* =============================================
               ENVIAR CORREO
               ============================================= */

            await enviarCorreoRecuperacion(
                usuario,
                enlace
            );


            res.json({

                mensaje:
                    "Si existe una cuenta con ese correo, recibirás un enlace para cambiar tu contraseña."

            });


        } catch (error) {

            console.error(
                "Error recuperando contraseña:",
                error
            );


            res.status(500).json({

                mensaje:
                    "No se pudo procesar la solicitud. Intenta nuevamente."

            });
        }
    }
);


/* =========================================================
   ESTABLECER NUEVA CONTRASEÑA
   ========================================================= */

app.post(
    "/reset-password",

    limiteAutenticacion,

    async (req, res) => {

        try {

            const token =
                String(
                    req.body.token || ""
                );


            const password =
                String(
                    req.body.password || ""
                );


            if (
                !token ||
                !password
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Datos incompletos."

                    });
            }


            if (
                password.length < 5
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "La contraseña debe tener al menos 5 caracteres."

                    });
            }


            const tokenHash =
                crypto
                    .createHash("sha256")
                    .update(token)
                    .digest("hex");


            const resultado =
                await pool.query(

                    `
                    SELECT id

                    FROM usuarios

                    WHERE password_reset_token_hash = $1

                    AND password_reset_expires_at >
                        CURRENT_TIMESTAMP
                    `,

                    [
                        tokenHash
                    ]

                );


            if (
                resultado.rows.length === 0
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "El enlace es inválido o ya expiró."

                    });
            }


            const usuarioId =
                resultado.rows[0].id;


            const passwordHash =
                await bcrypt.hash(
                    password,
                    SALT_ROUNDS
                );


            await pool.query(

                `
                UPDATE usuarios

                SET
                    password_hash = $1,
                    password_reset_token_hash = NULL,
                    password_reset_expires_at = NULL

                WHERE id = $2
                `,

                [
                    passwordHash,
                    usuarioId
                ]

            );


            res.json({

                mensaje:
                    "Contraseña actualizada correctamente."

            });


        } catch (error) {

            console.error(
                "Error cambiando contraseña:",
                error
            );


            res.status(500).json({

                mensaje:
                    "No se pudo cambiar la contraseña."

            });
        }
    }
);

/* =========================================================
   LOGIN

   Compatible con:
   - cuentas nuevas con bcrypt
   - cuentas antiguas sin bcrypt
   - migración automática
   ========================================================= */

app.post(
    "/login",

    limiteAutenticacion,

    async (req, res) => {

        try {

            const {
                correo,
                password
            } = req.body;


            const correoLimpio =
                String(
                    correo || ""
                ).trim();


            /* =============================================
               VALIDAR
               ============================================= */

            if (
                !correoLimpio ||
                !password
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Ingresa correo y contraseña"

                    });
            }


            /* =============================================
               BUSCAR USUARIO
               ============================================= */

            const resultado =
                await pool.query(

                    `
                    SELECT *

                    FROM usuarios

                    WHERE LOWER(correo) =
                          LOWER($1)
                    `,

                    [
                        correoLimpio
                    ]

                );


            if (
                resultado.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        mensaje:
                            "Usuario no encontrado"

                    });
            }


            let usuario =
                resultado.rows[0];


            /* =============================================
               CUENTA GOOGLE SIN CONTRASEÑA LOCAL
               ============================================= */

            if (!usuario.password_hash) {

                return res
                    .status(401)
                    .json({

                        mensaje:
                            "Esta cuenta utiliza inicio de sesión con Google."

                    });
            }


            let passwordCorrecta =
                false;


            /* =============================================
               CUENTA NUEVA - BCRYPT
               ============================================= */

            if (
                esHashBcrypt(
                    usuario.password_hash
                )
            ) {

                passwordCorrecta =
                    await bcrypt.compare(

                        password,

                        usuario.password_hash

                    );


            /* =============================================
               CUENTA ANTIGUA

               Todavía tiene contraseña en texto normal.
               ============================================= */

            } else {

                passwordCorrecta =

                    usuario.password_hash ===
                    password;


                /* =========================================
                   MIGRACIÓN AUTOMÁTICA

                   Si escribió correctamente su contraseña
                   antigua, la convertimos inmediatamente
                   a bcrypt.
                   ========================================= */

                if (passwordCorrecta) {

                    const nuevoHash =
                        await bcrypt.hash(

                            password,

                            SALT_ROUNDS

                        );


                    const actualizado =
                        await pool.query(

                            `
                            UPDATE usuarios

                            SET password_hash = $1

                            WHERE id = $2

                            RETURNING *
                            `,

                            [
                                nuevoHash,
                                usuario.id
                            ]

                        );


                    usuario =
                        actualizado.rows[0];


                    console.log(
                        `🔐 Contraseña migrada a bcrypt para usuario ${usuario.id}`
                    );
                }
            }


            /* =============================================
               CONTRASEÑA INCORRECTA
               ============================================= */

            if (!passwordCorrecta) {

                return res
                    .status(401)
                    .json({

                        mensaje:
                            "Contraseña incorrecta"

                    });
            }


            /* =============================================
               LOGIN CORRECTO
               ============================================= */
            crearCookieSesion(
                res,
                usuario
            );
            
            res.json({

                mensaje:
                    "Login exitoso",

                usuario:
                    usuarioSeguro(usuario)

            });


        } catch (error) {

            console.error(
                "Error en login:",
                error
            );


            res
                .status(500)
                .json({

                    mensaje:
                        "Error en el servidor"

                });
        }
    }
);

/* =========================================================
   ACTUALIZAR RACHA DEL USUARIO
   ========================================================= */

async function actualizarRachaUsuario(
    usuario_id,
    db = pool
) {

    try {

        const resultado =
            await db.query(

                `
                UPDATE usuarios

                SET

                    racha = CASE


                        /* =================================
                           PRIMERA ACTIVIDAD
                           ================================= */

                        WHEN ultima_actividad_racha IS NULL

                        THEN 1


                        /* =================================
                           YA HIZO UNA LECCIÓN HOY
                           ================================= */

                        WHEN
                            (
                                ultima_actividad_racha
                                AT TIME ZONE 'America/Guayaquil'
                            )::date

                            =

                            (
                                CURRENT_TIMESTAMP
                                AT TIME ZONE 'America/Guayaquil'
                            )::date

                        THEN COALESCE(
                            racha,
                            0
                        )


                        /* =================================
                           SIGUE DENTRO DE LAS 48 HORAS
                           ================================= */

                        WHEN

                            CURRENT_TIMESTAMP
                            - ultima_actividad_racha

                            <= INTERVAL '48 hours'

                        THEN

                            COALESCE(
                                racha,
                                0
                            ) + 1


                        /* =================================
                           PERDIÓ LA RACHA
                           ================================= */

                        ELSE 1

                    END,


                    /* =====================================
                       FECHA DE ÚLTIMA ACTIVIDAD
                       ===================================== */

                    ultima_actividad_racha = CASE


                        WHEN ultima_actividad_racha IS NULL

                        THEN CURRENT_TIMESTAMP


                        WHEN
                            (
                                ultima_actividad_racha
                                AT TIME ZONE 'America/Guayaquil'
                            )::date

                            =

                            (
                                CURRENT_TIMESTAMP
                                AT TIME ZONE 'America/Guayaquil'
                            )::date

                        THEN ultima_actividad_racha


                        ELSE CURRENT_TIMESTAMP

                    END


                WHERE id = $1

                RETURNING *;
                `,

                [
                    usuario_id
                ]

            );


        if (
            resultado.rows.length === 0
        ) {

            throw new Error(
                "Usuario no encontrado"
            );
        }


        console.log(
            `🔥 Racha usuario ${usuario_id}:`,
            resultado.rows[0].racha
        );


        return resultado.rows[0];


    } catch (error) {

        console.error(
            "Error actualizando racha:",
            error
        );

        throw error;
    }
}

/* =========================================================
   AUTENTICACIÓN GOOGLE (INTEGRADA A POSTGRESQL)
   ========================================================= */

app.post('/auth/google', limiteAutenticacion, async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        // El 'sub' es el ID único e inmutable de Google
        const googleId = payload.sub; 
        const correo = payload.email;
        const nombre = payload.given_name;
        const apellido = payload.family_name || "";
        const foto = payload.picture;

        // 1. Buscar primero por google_id, o en su defecto por correo
        let usuarioQuery = await pool.query(
            "SELECT * FROM usuarios WHERE google_id = $1 OR correo = $2", 
            [googleId, correo]
        );
        
        let usuario;

        if (usuarioQuery.rows.length === 0) {
            // 2. Si no existe, crearlo guardando el google_id
            const nuevoUsuario = await pool.query(
                `INSERT INTO usuarios (nombre, apellido, correo, foto_perfil, google_id) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [nombre, apellido, correo, foto, googleId]
            );
            usuario = nuevoUsuario.rows[0];
        } else {
            usuario = usuarioQuery.rows[0];

            // 3. Opcional: Si el usuario existía por correo pero no tenía google_id, se lo vinculamos
            if (!usuario.google_id) {
                const usuarioVinculado = await pool.query(
                    `UPDATE usuarios SET google_id = $1 WHERE id = $2 RETURNING *`,
                    [googleId, usuario.id]
                );
                usuario = usuarioVinculado.rows[0];
            }
        }

        crearCookieSesion(
            res,
            usuario
        );

        res.status(200).json({

            mensaje:
                "Login con Google exitoso",

            usuario:
                usuarioSeguro(usuario)
        });

    } catch (error) {
        console.error("Error verificando el token de Google:", error);
        res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
});

/* =========================================================
   USUARIO AUTENTICADO
   ========================================================= */

app.get("/auth/me", autenticarUsuario, async (req, res) => {

        try {

            const resultado =
                await pool.query(

                    `
                    SELECT *

                    FROM usuarios

                    WHERE id = $1
                    `,

                    [
                        req.usuario.id
                    ]

                );


            if (
                resultado.rows.length === 0
            ) {

                eliminarCookieSesion(
                    res
                );


                return res
                    .status(404)
                    .json({

                        mensaje:
                            "Usuario no encontrado"

                    });
            }


            res.json({

                usuario:
                    usuarioSeguro(
                        resultado.rows[0]
                    )

            });


        } catch (error) {

            console.error(
                "Error consultando sesión:",
                error
            );


            res
                .status(500)
                .json({

                    mensaje:
                        "Error comprobando sesión"

                });
        }
    }
);

/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

app.post( "/logout", (req, res) => {

        eliminarCookieSesion(
            res
        );


        res.json({

            mensaje:
                "Sesión cerrada"

        });
    }
);

const LECCIONES_VALIDAS = new Set([

    /* NIVEL 1 */

    "hola",
    "adios",
    "mi_nombre",
    "como_te_llamas",


    /* NIVEL 2 */

    "familia",
    "padre",
    "madre",
    "hermano",


    /* NIVEL 3 */

    "numero_1_2",
    "numero_3_4",
    "numero_5_6",
    "numero_7_10",


    /* NIVEL 4 */

    "color_rojo",
    "color_amarillo",
    "color_verde",
    "color_blanco_negro",


    /* NIVEL 5 */

    "perro",
    "gato",
    "vaca",
    "condor"

]);

const CONFIG_RETOS_DIARIOS = [

    {
        tipo:
            "completar_lecciones",

        titulo:
            "🎯 Completa 2 lecciones",

        descripcion:
            "Termina dos lecciones durante el día.",

        objetivo:
            2,

        recompensa_xp:
            15,

        recompensa_monedas:
            0
    },


    {
        tipo:
            "respuestas_correctas",

        titulo:
            "✅ Consigue 6 respuestas correctas",

        descripcion:
            "Responde correctamente seis preguntas.",

        objetivo:
            6,

        recompensa_xp:
            0,

        recompensa_monedas:
            10
    },


    {
        tipo:
            "actividad_diaria",

        titulo:
            "🔥 Completa una lección hoy",

        descripcion:
            "Mantén tu aprendizaje activo completando al menos una lección.",

        objetivo:
            1,

        recompensa_xp:
            5,

        recompensa_monedas:
            0
    }

];

async function asegurarRetosDiarios(
    usuario_id,
    db = pool
) {

    for (
        const reto
        of CONFIG_RETOS_DIARIOS
    ) {

        await db.query(

            `
            INSERT INTO retos_diarios
            (
                usuario_id,
                fecha,
                tipo_reto,
                titulo,
                descripcion,
                objetivo,
                progreso,
                recompensa_xp,
                recompensa_monedas,
                completado,
                reclamado
            )

            VALUES
            (
                $1,

                (
                    CURRENT_TIMESTAMP
                    AT TIME ZONE 'America/Guayaquil'
                )::date,

                $2,
                $3,
                $4,
                $5,
                0,
                $6,
                $7,
                false,
                false
            )

            ON CONFLICT
            (
                usuario_id,
                fecha,
                tipo_reto
            )

            DO NOTHING
            `,

            [
                usuario_id,
                reto.tipo,
                reto.titulo,
                reto.descripcion,
                reto.objetivo,
                reto.recompensa_xp,
                reto.recompensa_monedas
            ]

        );
    }
}

async function actualizarRetosDiarios(
    usuario_id,
    aciertos,
    db = pool
) {

    /* =====================================================
       ASEGURAR QUE EXISTAN
       ===================================================== */

    await asegurarRetosDiarios(
        usuario_id,
        db
    );


    /* =====================================================
       RETO 1:
       COMPLETAR LECCIONES
       ===================================================== */

    await db.query(

        `
        UPDATE retos_diarios

        SET

            progreso =
                LEAST(
                    progreso + 1,
                    objetivo
                ),

            completado =
                (
                    LEAST(
                        progreso + 1,
                        objetivo
                    )
                    >= objetivo
                )

        WHERE usuario_id = $1

        AND fecha =
            (
                CURRENT_TIMESTAMP
                AT TIME ZONE 'America/Guayaquil'
            )::date

        AND tipo_reto =
            'completar_lecciones'
        `,

        [
            usuario_id
        ]

    );

    await db.query(

        `
        UPDATE retos_diarios

        SET

            progreso =
                LEAST(
                    progreso + $2,
                    objetivo
                ),

            completado =
                (
                    LEAST(
                        progreso + $2,
                        objetivo
                    )
                    >= objetivo
                )

        WHERE usuario_id = $1

        AND fecha =
            (
                CURRENT_TIMESTAMP
                AT TIME ZONE 'America/Guayaquil'
            )::date

        AND tipo_reto =
            'respuestas_correctas'
        `,

        [
            usuario_id,
            aciertos
        ]

    );


    /* =====================================================
       RETO 3:
       ACTIVIDAD DEL DÍA
       ===================================================== */

    await db.query(

        `
        UPDATE retos_diarios

        SET

            progreso = 1,

            completado = true

        WHERE usuario_id = $1

        AND fecha =
            (
                CURRENT_TIMESTAMP
                AT TIME ZONE 'America/Guayaquil'
            )::date

        AND tipo_reto =
            'actividad_diaria'
        `,

        [
            usuario_id
        ]

    );
}

app.post("/guardar-leccion", autenticarUsuario, async (req, res) => {

        /* =================================================
           VALIDAR DATOS ANTES DE ABRIR TRANSACCIÓN
           ================================================= */

        const usuario_id = req.usuario.id;

        const leccion = String(req.body.leccion || "").trim();

        const aciertos = Number(req.body.aciertos);

        if (
            !Number.isInteger(usuario_id) ||
            usuario_id <= 0
        ) {

            return res
                .status(400)
                .json({

                    mensaje:
                        "Usuario inválido"

                });
        }

        if (!leccion) {

            return res
                .status(400)
                .json({

                    mensaje:
                        "Debes indicar una lección"

                });
        }

        if (
            !Number.isInteger(aciertos) ||
            aciertos < 0 ||
            aciertos > 3
        ) {

            return res
                .status(400)
                .json({

                    mensaje:
                        "Cantidad de aciertos inválida"

                });
        }

        /* =================================================
           VALIDAR QUE SEA UNA LECCIÓN REAL
           ================================================= */

        if (
            !LECCIONES_VALIDAS.has(
                leccion
            )
        ) {

            console.warn(
                `⚠️ Intento de guardar lección inválida: ${leccion}`
            );


            return res
                .status(400)
                .json({

                    mensaje:
                        "La lección indicada no existe"

                });
        }

        /* =================================================
           ABRIR CONEXIÓN
           ================================================= */

        const cliente =
            await pool.connect();


        try {

            /* =============================================
               INICIAR TRANSACCIÓN
               ============================================= */

            await cliente.query(
                "BEGIN"
            );


            /* =============================================
               BLOQUEAR USUARIO

               Esto evita recompensas dobles si se
               hacen dos solicitudes simultáneas.
               ============================================= */

            const usuarioExiste =
                await cliente.query(

                    `
                    SELECT id

                    FROM usuarios

                    WHERE id = $1

                    FOR UPDATE
                    `,

                    [
                        usuario_id
                    ]

                );


            if (
                usuarioExiste.rows.length === 0
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(404)
                    .json({

                        mensaje:
                            "Usuario no encontrado"

                    });
            }


            /* =============================================
               COMPROBAR SI LA LECCIÓN YA EXISTE
               ============================================= */

            const existe =
                await cliente.query(

                    `
                    SELECT id

                    FROM progreso_lecciones

                    WHERE usuario_id = $1
                    AND leccion = $2

                    FOR UPDATE
                    `,

                    [
                        usuario_id,
                        leccion
                    ]

                );


            const primeraVez =
                existe.rows.length === 0;



            /* =============================================
               PRIMERA VEZ
               ============================================= */

            let resultadoProgreso;


            if (primeraVez) {

                resultadoProgreso =
                    await cliente.query(

                        `
                        INSERT INTO progreso_lecciones
                        (
                            usuario_id,
                            leccion,
                            completada,
                            fecha_completada,
                            fecha_ultimo_intento
                        )

                        VALUES
                        (
                            $1,
                            $2,
                            true,
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        )

                        RETURNING *
                        `,

                        [
                            usuario_id,
                            leccion
                        ]

                    );


            /* =============================================
               REPETICIÓN
               ============================================= */

            } else {

                resultadoProgreso =
                    await cliente.query(

                        `
                        UPDATE progreso_lecciones

                        SET
                            completada = true,
                            fecha_ultimo_intento =
                                CURRENT_TIMESTAMP

                        WHERE usuario_id = $1
                        AND leccion = $2

                        RETURNING *
                        `,

                        [
                            usuario_id,
                            leccion
                        ]

                    );
            }



            /* =============================================
               RECOMPENSAS

               IMPORTANTE:
               Las decide exclusivamente el servidor.
               ============================================= */

            const xpPorAcierto =
                primeraVez
                    ? 10
                    : 5;


            const xpGanada =
                aciertos *
                xpPorAcierto;


            const monedasGanadas =
                primeraVez
                    ? 20
                    : 5;



            /* =============================================
               ACTUALIZAR XP Y MONEDAS
               ============================================= */

            await cliente.query(

                `
                UPDATE usuarios

                SET
                    xp =
                        COALESCE(xp, 0)
                        + $1,

                    monedas =
                        COALESCE(monedas, 0)
                        + $2

                WHERE id = $3
                `,

                [
                    xpGanada,
                    monedasGanadas,
                    usuario_id
                ]

            );



            /* =============================================
               ACTUALIZAR RACHA

               Toda lección realmente terminada cuenta
               para mantener/aumentar la racha.
               ============================================= */

            await actualizarRachaUsuario(
                usuario_id,
                cliente
            );

            await actualizarRetosDiarios(

                usuario_id,

                aciertos,

                cliente

            );

            /* =============================================
               ACTUALIZAR NIVEL

               Respeta los niveles comprados.
               ============================================= */

            const usuarioActualizado =
                await actualizarNivelUsuario(
                    usuario_id,
                    cliente
                );

            /* =============================================
            EVALUAR NUEVOS LOGROS
            ============================================= */

            const {
                nuevosLogros
            } =
                await evaluarLogrosUsuario(

                    usuario_id,

                    cliente

                );

            /* =============================================
               CONFIRMAR TODO
               ============================================= */

            await cliente.query(
                "COMMIT"
            );



            /* =============================================
               RESPUESTA AL FRONTEND
               ============================================= */

            return res.json({

                mensaje:
                    primeraVez

                        ? "Lección completada por primera vez"

                        : "Lección repetida",


                primera_vez:
                    primeraVez,


                xp_ganada:
                    xpGanada,


                monedas_ganadas:
                    monedasGanadas,

                logros_nuevos:
                    nuevosLogros,


                progreso:
                    resultadoProgreso.rows[0],


                usuario:
                    usuarioSeguro(usuarioActualizado)

            });


        } catch (error) {


            /* =============================================
               REVERTIR SI ALGO FALLÓ
               ============================================= */

            await cliente.query(
                "ROLLBACK"
            );


            console.error(
                "Error guardando lección:",
                error
            );


            return res
                .status(500)
                .json({

                    mensaje:
                        "Error al guardar la lección"

                });


        } finally {


            /* =============================================
               LIBERAR CONEXIÓN
               ============================================= */

            cliente.release();
        }
    }
);

/* =========================================================
   ECONOMÍA DE DESBLOQUEO DE NIVELES
   ========================================================= */

const COSTOS_NIVELES = {

    2: 30,
    3: 35,
    4: 40,
    5: 45

};


const LECCIONES_POR_NIVEL = {

    1: [
        "hola",
        "adios",
        "mi_nombre",
        "como_te_llamas"
    ],

    2: [
        "familia",
        "padre",
        "madre",
        "hermano"
    ],

    3: [
        "numero_1_2",
        "numero_3_4",
        "numero_5_6",
        "numero_7_10"
    ],

    4: [
        "color_rojo",
        "color_amarillo",
        "color_verde",
        "color_blanco_negro"
    ],

    5: [
        "perro",
        "gato",
        "vaca",
        "condor"
    ]

};

/* =========================================================
   ENDPOINT DE PROGRESO
   ========================================================= */

app.get("/progreso/:usuario_id", autenticarUsuario, async (req, res) => {

    try {

        const usuario_id = req.usuario.id;

        const result = await pool.query(`SELECT leccion,completada, fecha_ultimo_intento
                                        FROM progreso_lecciones WHERE usuario_id = $1`,
                                        [usuario_id]
        );

        res.json(result.rows);

    } catch (error) {

        console.error("Error obteniendo progreso:",error);

        res.status(500).json({
            mensaje:"Error al obtener progreso"
        });
    }
});

app.post("/perfil/foto", autenticarUsuario, (req, res) => {
    subirFotoPerfil.single("foto")(req, res, async function (errorSubida) {
        if (errorSubida) {
            return res.status(400).json({ mensaje: errorSubida.message });
        }

        try {
            const usuario_id = req.usuario.id;

            if (!usuario_id) {
                if (req.file) await fs.promises.unlink(req.file.path);
                return res.status(400).json({ mensaje: "Usuario inválido" });
            }

            if (!req.file) {
                return res.status(400).json({ mensaje: "Debes seleccionar una imagen" });
            }

            const usuarioAnterior = await pool.query(
                `SELECT foto_perfil FROM usuarios WHERE id = $1`,
                [usuario_id]
            );

            if (usuarioAnterior.rows.length === 0) {
                await fs.promises.unlink(req.file.path);
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }

            const fotoAnterior = usuarioAnterior.rows[0].foto_perfil;
            const nuevaRuta = `/uploads/perfiles/${req.file.filename}`;

            const resultado = await pool.query(
                `UPDATE usuarios SET foto_perfil = $1 WHERE id = $2 RETURNING *`,
                [nuevaRuta, usuario_id]
            );

            await eliminarArchivoFotoPerfil(fotoAnterior);

            res.json({
                mensaje: "Foto de perfil actualizada",
                usuario: usuarioSeguro(resultado.rows[0])
            });

        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                await fs.promises.unlink(req.file.path);
            }
            console.error("Error actualizando foto:", error);
            res.status(500).json({ mensaje: "Error al actualizar la foto de perfil" });
        }
    });
});

app.delete("/perfil/foto/:usuario_id", autenticarUsuario, async (req, res) => {
    try {
        const usuario_id = req.usuario.id;

        if (!usuario_id) {
            return res.status(400).json({ mensaje: "Usuario inválido" });
        }

        const usuarioActual = await pool.query(
            `SELECT foto_perfil FROM usuarios WHERE id = $1`,
            [usuario_id]
        );

        if (usuarioActual.rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const fotoAnterior = usuarioActual.rows[0].foto_perfil;

        const resultado = await pool.query(
            `UPDATE usuarios SET foto_perfil = NULL WHERE id = $1 RETURNING *`,
            [usuario_id]
        );

        await eliminarArchivoFotoPerfil(fotoAnterior);

        res.json({
            mensaje: "Foto de perfil eliminada",
            usuario: usuarioSeguro(resultado.rows[0])
        });

    } catch (error) {
        console.error("Error eliminando foto:", error);
        res.status(500).json({ mensaje: "Error al eliminar la foto de perfil" });
    }
});

/* =========================================================
   CONSULTAR NIVELES DESBLOQUEADOS
   ========================================================= */

app.get("/niveles-desbloqueados/:usuario_id", autenticarUsuario, async (req, res) => {

        try {

            const usuario_id = req.usuario.id;

            if (!usuario_id) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Usuario inválido"

                    });
            }


            const resultado =
                await pool.query(

                    `
                    SELECT
                        nivel,
                        costo_pagado,
                        fecha_desbloqueo

                    FROM niveles_desbloqueados

                    WHERE usuario_id = $1

                    ORDER BY nivel
                    `,

                    [
                        usuario_id
                    ]

                );


            res.json(
                resultado.rows
            );


        } catch (error) {

            console.error(
                "Error consultando niveles desbloqueados:",
                error
            );


            res.status(500).json({

                mensaje:
                    "Error consultando niveles"

            });
        }
    }
);

/* =========================================================
   COMPRAR / DESBLOQUEAR NIVEL
   ========================================================= */

app.post("/desbloquear-nivel", autenticarUsuario, async (req, res) => {

        const cliente =
            await pool.connect();


        try {

            const usuario_id = req.usuario.id;

            const nivel = Number(req.body.nivel);


            /* =============================================
               VALIDACIONES
               ============================================= */

            if (
                !usuario_id ||
                !COSTOS_NIVELES[nivel]
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Usuario o nivel inválido"

                    });
            }


            const costo =
                COSTOS_NIVELES[nivel];


            const nivelAnterior =
                nivel - 1;


            await cliente.query(
                "BEGIN"
            );


            /* =============================================
               BLOQUEAR USUARIO DURANTE LA COMPRA

               Esto evita cobrar dos veces si se hacen
               dos solicitudes al mismo tiempo.
               ============================================= */

            const resultadoUsuario =
                await cliente.query(

                    `
                    SELECT *

                    FROM usuarios

                    WHERE id = $1

                    FOR UPDATE
                    `,

                    [
                        usuario_id
                    ]

                );


            if (
                resultadoUsuario.rows.length === 0
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(404)
                    .json({

                        mensaje:
                            "Usuario no encontrado"

                    });
            }


            const usuario =
                resultadoUsuario.rows[0];


            /* =============================================
               COMPROBAR SI YA LO COMPRÓ
               ============================================= */

            const yaDesbloqueado =
                await cliente.query(

                    `
                    SELECT *

                    FROM niveles_desbloqueados

                    WHERE usuario_id = $1
                    AND nivel = $2
                    `,

                    [
                        usuario_id,
                        nivel
                    ]

                );


            if (
                yaDesbloqueado.rows.length > 0
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(409)
                    .json({

                        mensaje:
                            `El Nivel ${nivel} ya está desbloqueado`

                    });
            }


            /* =============================================
               COMPROBAR NIVEL ANTERIOR COMPLETO
               ============================================= */

            const leccionesNecesarias =
                LECCIONES_POR_NIVEL[
                    nivelAnterior
                ];


            const progreso =
                await cliente.query(

                    `
                    SELECT leccion

                    FROM progreso_lecciones

                    WHERE usuario_id = $1
                    AND completada = true
                    `,

                    [
                        usuario_id
                    ]

                );


            const leccionesCompletadas =
                new Set(

                    progreso.rows.map(
                        item =>
                            item.leccion
                    )

                );


            const nivelAnteriorCompletado =
                leccionesNecesarias.every(
                    leccion =>
                        leccionesCompletadas.has(
                            leccion
                        )
                );


            if (!nivelAnteriorCompletado) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(400)
                    .json({

                        mensaje:
                            `Debes completar el Nivel ${nivelAnterior} antes de desbloquear el Nivel ${nivel}.`

                    });
            }


            /* =============================================
               VERIFICAR MONEDAS
               ============================================= */

            const monedasActuales =
                Number(
                    usuario.monedas || 0
                );


            if (
                monedasActuales <
                costo
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(400)
                    .json({

                        mensaje:
                            `Necesitas ${costo} monedas para desbloquear el Nivel ${nivel}. Tienes ${monedasActuales}.`,

                        monedas_necesarias:
                            costo,

                        monedas_actuales:
                            monedasActuales

                    });
            }


            /* =============================================
               DESCONTAR MONEDAS
               ============================================= */

            await cliente.query(

                `
                UPDATE usuarios

                SET
                    monedas = monedas - $1,
                    nivel = GREATEST(nivel, $2)

                WHERE id = $3
                `,

                [
                    costo,
                    nivel,
                    usuario_id
                ]

            );


            /* =============================================
               GUARDAR COMPRA
               ============================================= */

            await cliente.query(

                `
                INSERT INTO niveles_desbloqueados
                (
                    usuario_id,
                    nivel,
                    costo_pagado
                )

                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                `,

                [
                    usuario_id,
                    nivel,
                    costo
                ]

            );


            /* =============================================
               OBTENER USUARIO ACTUALIZADO
               ============================================= */

            const usuarioActualizado =
                await cliente.query(

                    `
                    SELECT *

                    FROM usuarios

                    WHERE id = $1
                    `,

                    [
                        usuario_id
                    ]

                );


            await cliente.query(
                "COMMIT"
            );


            res.json({

                mensaje:
                    `Nivel ${nivel} desbloqueado correctamente`,

                nivel_desbloqueado:
                    nivel,

                costo_pagado:
                    costo,

                usuario:
                    usuarioSeguro(usuarioActualizado.rows[0])

            });


        } catch (error) {

            await cliente.query(
                "ROLLBACK"
            );


            console.error(
                "Error desbloqueando nivel:",
                error
            );


            res
                .status(500)
                .json({

                    mensaje:
                        "Error al desbloquear el nivel"

                });


        } finally {

            cliente.release();
        }
    }
);

/* =========================================================
   CONSULTAR RETOS DIARIOS
   ========================================================= */

app.get(
    "/retos-diarios",

    autenticarUsuario,

    async (req, res) => {

        try {

            const usuario_id =
                req.usuario.id;


            /* =============================================
               CREAR RETOS SI ES UN NUEVO DÍA
               ============================================= */

            await asegurarRetosDiarios(
                usuario_id
            );


            /* =============================================
               CONSULTAR
               ============================================= */

            const resultado =
                await pool.query(

                    `
                    SELECT

                        id,
                        tipo_reto,
                        titulo,
                        descripcion,
                        objetivo,
                        progreso,
                        recompensa_xp,
                        recompensa_monedas,
                        completado,
                        reclamado

                    FROM retos_diarios

                    WHERE usuario_id = $1

                    AND fecha =
                        (
                            CURRENT_TIMESTAMP
                            AT TIME ZONE 'America/Guayaquil'
                        )::date

                    ORDER BY id
                    `,

                    [
                        usuario_id
                    ]

                );


            res.json(
                resultado.rows
            );


        } catch (error) {

            console.error(
                "Error consultando retos:",
                error
            );


            res
                .status(500)
                .json({

                    mensaje:
                        "Error al consultar los retos"

                });
        }
    }
);

/* =========================================================
   RECLAMAR RECOMPENSA DE RETO
   ========================================================= */

app.post(
    "/retos-diarios/reclamar",

    autenticarUsuario,

    async (req, res) => {


        const cliente =
            await pool.connect();


        try {

            const usuario_id =
                req.usuario.id;


            const reto_id =
                Number(
                    req.body.reto_id
                );


            if (
                !Number.isInteger(reto_id) ||
                reto_id <= 0
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Reto inválido"

                    });
            }


            await cliente.query(
                "BEGIN"
            );


            /* =============================================
               BLOQUEAR RETO
               ============================================= */

            const resultadoReto =
                await cliente.query(

                    `
                    SELECT *

                    FROM retos_diarios

                    WHERE id = $1

                    AND usuario_id = $2

                    AND fecha =
                        (
                            CURRENT_TIMESTAMP
                            AT TIME ZONE 'America/Guayaquil'
                        )::date

                    FOR UPDATE
                    `,

                    [
                        reto_id,
                        usuario_id
                    ]

                );


            if (
                resultadoReto.rows.length === 0
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(404)
                    .json({

                        mensaje:
                            "Reto no encontrado"

                    });
            }


            const reto =
                resultadoReto.rows[0];


            /* =============================================
               COMPROBAR QUE ESTÁ COMPLETADO
               ============================================= */

            if (
                reto.progreso <
                reto.objetivo
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Todavía no has completado este reto"

                    });
            }


            /* =============================================
               COMPROBAR QUE NO FUE RECLAMADO
               ============================================= */

            if (reto.reclamado) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(409)
                    .json({

                        mensaje:
                            "Esta recompensa ya fue reclamada"

                    });
            }


            /* =============================================
               DAR RECOMPENSA
               ============================================= */

            const usuarioActualizado =
                await cliente.query(

                    `
                    UPDATE usuarios

                    SET

                        xp =
                            COALESCE(xp, 0)
                            + $1,

                        monedas =
                            COALESCE(monedas, 0)
                            + $2

                    WHERE id = $3

                    RETURNING *
                    `,

                    [
                        reto.recompensa_xp,
                        reto.recompensa_monedas,
                        usuario_id
                    ]

                );


            /* =============================================
               MARCAR RECLAMADO
               ============================================= */

            await cliente.query(

                `
                UPDATE retos_diarios

                SET

                    reclamado = true,

                    fecha_reclamado =
                        CURRENT_TIMESTAMP

                WHERE id = $1
                `,

                [
                    reto_id
                ]

            );

            const {
                nuevosLogros
            } =
                await evaluarLogrosUsuario(
                    usuario_id,
                    cliente
                );

            await cliente.query(
                "COMMIT"
            );


            return res.json({

                mensaje:
                    "Recompensa reclamada",

                recompensa_xp:
                    reto.recompensa_xp,

                recompensa_monedas:
                    reto.recompensa_monedas,

                logros_nuevos:
                    nuevosLogros,

                usuario:
                    usuarioSeguro(
                        usuarioActualizado.rows[0]
                    )

            });


        } catch (error) {

            await cliente.query(
                "ROLLBACK"
            );


            console.error(
                "Error reclamando reto:",
                error
            );


            res
                .status(500)
                .json({

                    mensaje:
                        "Error al reclamar recompensa"

                });


        } finally {

            cliente.release();
        }
    }
);

/* =========================================================
   CATÁLOGO DE LA TIENDA
   ========================================================= */

const ARTICULOS_TIENDA = {

    marco_yachay: {

        id:
            "marco_yachay",

        tipo:
            "marco_perfil",

        nombre:
            "💜 Marco Yachay",

        descripcion:
            "Un marco con los colores característicos de YachayPlay.",

        precio:
            25
    },


    marco_fuego: {

        id:
            "marco_fuego",

        tipo:
            "marco_perfil",

        nombre:
            "🔥 Marco Fuego",

        descripcion:
            "Un marco inspirado en las rachas de aprendizaje.",

        precio:
            40
    },


    marco_dorado: {

        id:
            "marco_dorado",

        tipo:
            "marco_perfil",

        nombre:
            "👑 Marco Dorado",

        descripcion:
            "Un marco dorado para destacar tu perfil.",

        precio:
            60
    },


    marco_kuntur: {

        id:
            "marco_kuntur",

        tipo:
            "marco_perfil",

        nombre:
            "🦅 Marco Kuntur",

        descripcion:
            "Un marco especial inspirado en Kuntur.",

        precio:
            80
    }

};

/* =========================================================
   CONSULTAR TIENDA
   ========================================================= */

app.get(
    "/tienda",

    autenticarUsuario,

    async (req, res) => {

        try {

            const usuario_id =
                req.usuario.id;


            /* =============================================
               USUARIO
               ============================================= */

            const resultadoUsuario =
                await pool.query(

                    `
                    SELECT
                        monedas,
                        marco_perfil

                    FROM usuarios

                    WHERE id = $1
                    `,

                    [
                        usuario_id
                    ]

                );


            if (
                resultadoUsuario.rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        mensaje:
                            "Usuario no encontrado"

                    });
            }


            const usuario =
                resultadoUsuario.rows[0];


            /* =============================================
               COMPRAS DEL USUARIO
               ============================================= */

            const resultadoCompras =
                await pool.query(

                    `
                    SELECT articulo_id

                    FROM compras_tienda

                    WHERE usuario_id = $1
                    `,

                    [
                        usuario_id
                    ]

                );


            const comprados =
                new Set(

                    resultadoCompras.rows.map(
                        compra =>
                            compra.articulo_id
                    )

                );


            /* =============================================
               CREAR CATÁLOGO PARA EL FRONTEND
               ============================================= */

            const articulos =
                Object
                    .values(
                        ARTICULOS_TIENDA
                    )
                    .map(
                        articulo => ({

                            ...articulo,

                            comprado:
                                comprados.has(
                                    articulo.id
                                ),

                            equipado:

                                usuario.marco_perfil ===
                                articulo.id

                        })
                    );


            res.json({

                monedas:
                    Number(
                        usuario.monedas || 0
                    ),

                marco_equipado:
                    usuario.marco_perfil ||
                    "ninguno",

                articulos

            });


        } catch (error) {

            console.error(
                "Error consultando tienda:",
                error
            );


            res.status(500).json({

                mensaje:
                    "Error al consultar la tienda"

            });
        }
    }
);

/* =========================================================
   COMPRAR ARTÍCULO
   ========================================================= */

app.post(
    "/tienda/comprar",

    autenticarUsuario,

    async (req, res) => {


        const cliente =
            await pool.connect();


        try {

            const usuario_id =
                req.usuario.id;


            const articulo_id =
                String(
                    req.body.articulo_id || ""
                ).trim();


            /* =============================================
               VALIDAR ARTÍCULO
               ============================================= */

            const articulo =
                ARTICULOS_TIENDA[
                    articulo_id
                ];


            if (!articulo) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "El artículo no existe"

                    });
            }


            await cliente.query(
                "BEGIN"
            );


            /* =============================================
               BLOQUEAR USUARIO
               ============================================= */

            const resultadoUsuario =
                await cliente.query(

                    `
                    SELECT *

                    FROM usuarios

                    WHERE id = $1

                    FOR UPDATE
                    `,

                    [
                        usuario_id
                    ]

                );


            if (
                resultadoUsuario.rows.length === 0
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(404)
                    .json({

                        mensaje:
                            "Usuario no encontrado"

                    });
            }


            const usuario =
                resultadoUsuario.rows[0];


            /* =============================================
               ¿YA LO COMPRÓ?
               ============================================= */

            const compraAnterior =
                await cliente.query(

                    `
                    SELECT id

                    FROM compras_tienda

                    WHERE usuario_id = $1
                    AND articulo_id = $2
                    `,

                    [
                        usuario_id,
                        articulo.id
                    ]

                );


            if (
                compraAnterior.rows.length > 0
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(409)
                    .json({

                        mensaje:
                            "Ya compraste este artículo"

                    });
            }


            /* =============================================
               MONEDAS
               ============================================= */

            const monedasActuales =
                Number(
                    usuario.monedas || 0
                );


            if (
                monedasActuales <
                articulo.precio
            ) {

                await cliente.query(
                    "ROLLBACK"
                );


                return res
                    .status(400)
                    .json({

                        mensaje:
                            `Necesitas ${articulo.precio} monedas. Actualmente tienes ${monedasActuales}.`

                    });
            }


            /* =============================================
               DESCONTAR MONEDAS
               ============================================= */

            const usuarioActualizado =
                await cliente.query(

                    `
                    UPDATE usuarios

                    SET
                        monedas =
                            monedas - $1

                    WHERE id = $2

                    RETURNING *
                    `,

                    [
                        articulo.precio,
                        usuario_id
                    ]

                );


            /* =============================================
               GUARDAR COMPRA
               ============================================= */

            await cliente.query(

                `
                INSERT INTO compras_tienda
                (
                    usuario_id,
                    articulo_id,
                    tipo_articulo,
                    precio_pagado
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                `,

                [
                    usuario_id,
                    articulo.id,
                    articulo.tipo,
                    articulo.precio
                ]

            );

            /* =============================================
            EVALUAR LOGROS
            ============================================= */

            const {
                nuevosLogros
            } =
                await evaluarLogrosUsuario(
                    usuario_id,
                    cliente
                );

            await cliente.query(
                "COMMIT"
            );


            res.json({

                mensaje:
                    "Artículo comprado correctamente",
                    articulo,

                logros_nuevos:
                    nuevosLogros,

                usuario:
                    usuarioSeguro(
                        usuarioActualizado.rows[0]
                    )

            });


        } catch (error) {

            await cliente.query(
                "ROLLBACK"
            );


            console.error(
                "Error comprando artículo:",
                error
            );


            res.status(500).json({

                mensaje:
                    "Error al comprar el artículo"

            });


        } finally {

            cliente.release();
        }
    }
);

/* =========================================================
   EQUIPAR MARCO
   ========================================================= */

app.post(
    "/tienda/equipar",

    autenticarUsuario,

    async (req, res) => {

        try {

            const usuario_id =
                req.usuario.id;


            const marco_id =
                String(
                    req.body.marco_id || ""
                ).trim();


            /* =============================================
               QUITAR MARCO
               ============================================= */

            if (
                marco_id ===
                "ninguno"
            ) {

                const resultado =
                    await pool.query(

                        `
                        UPDATE usuarios

                        SET marco_perfil =
                            'ninguno'

                        WHERE id = $1

                        RETURNING *
                        `,

                        [
                            usuario_id
                        ]

                    );


                return res.json({

                    mensaje:
                        "Marco retirado",

                    usuario:
                        usuarioSeguro(
                            resultado.rows[0]
                        )

                });
            }


            /* =============================================
               VALIDAR ARTÍCULO
               ============================================= */

            const articulo =
                ARTICULOS_TIENDA[
                    marco_id
                ];


            if (
                !articulo ||
                articulo.tipo !==
                    "marco_perfil"
            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            "Marco inválido"

                    });
            }


            /* =============================================
               COMPROBAR COMPRA
               ============================================= */

            const compra =
                await pool.query(

                    `
                    SELECT id

                    FROM compras_tienda

                    WHERE usuario_id = $1
                    AND articulo_id = $2
                    `,

                    [
                        usuario_id,
                        marco_id
                    ]

                );


            if (
                compra.rows.length === 0
            ) {

                return res
                    .status(403)
                    .json({

                        mensaje:
                            "Debes comprar este marco antes de equiparlo"

                    });
            }


            /* =============================================
               EQUIPAR
               ============================================= */

            const resultado =
                await pool.query(

                    `
                    UPDATE usuarios

                    SET marco_perfil = $1

                    WHERE id = $2

                    RETURNING *
                    `,

                    [
                        marco_id,
                        usuario_id
                    ]

                );


            res.json({

                mensaje:
                    "Marco equipado correctamente",

                usuario:
                    usuarioSeguro(
                        resultado.rows[0]
                    )

            });


        } catch (error) {

            console.error(
                "Error equipando marco:",
                error
            );


            res.status(500).json({

                mensaje:
                    "Error al equipar el marco"

            });
        }
    }
);

/* =========================================================
   CATÁLOGO DE LOGROS
   ========================================================= */

const CATALOGO_LOGROS = [

    {
        id:
            "primera_leccion",

        icono:
            "🎓",

        nombre:
            "Primer paso",

        descripcion:
            "Completa tu primera lección.",

        objetivo:
            1,

        tipo:
            "lecciones"
    },


    {
        id:
            "cinco_lecciones",

        icono:
            "📚",

        nombre:
            "Aprendiz constante",

        descripcion:
            "Completa 5 lecciones.",

        objetivo:
            5,

        tipo:
            "lecciones"
    },


    {
        id:
            "diez_lecciones",

        icono:
            "🧠",

        nombre:
            "Estudiante dedicado",

        descripcion:
            "Completa 10 lecciones.",

        objetivo:
            10,

        tipo:
            "lecciones"
    },


    {
        id:
            "maestro_yachay",

        icono:
            "🦅",

        nombre:
            "Maestro Yachay",

        descripcion:
            "Completa las 20 lecciones de YachayPlay.",

        objetivo:
            20,

        tipo:
            "lecciones"
    },


    {
        id:
            "nivel_1_completo",

        icono:
            "💜",

        nombre:
            "Primer nivel superado",

        descripcion:
            "Completa todas las lecciones del Nivel 1.",

        objetivo:
            4,

        tipo:
            "nivel_1"
    },


    {
        id:
            "racha_3",

        icono:
            "🔥",

        nombre:
            "Constante",

        descripcion:
            "Alcanza una racha de 3 días.",

        objetivo:
            3,

        tipo:
            "racha"
    },


    {
        id:
            "primer_reto",

        icono:
            "🎯",

        nombre:
            "Retador",

        descripcion:
            "Completa tu primer reto diario.",

        objetivo:
            1,

        tipo:
            "retos"
    },


    {
        id:
            "primera_compra",

        icono:
            "🛍️",

        nombre:
            "Coleccionista",

        descripcion:
            "Compra tu primer artículo en la tienda.",

        objetivo:
            1,

        tipo:
            "compras"
    }

];

/* =========================================================
   CALCULAR ESTADO DE LOS LOGROS
   ========================================================= */

async function evaluarLogrosUsuario(
    usuario_id,
    db = pool
) {

    /* =====================================================
       LECCIONES COMPLETADAS
       ===================================================== */

    const resultadoLecciones =
        await db.query(

            `
            SELECT
                COUNT(DISTINCT leccion)::int
                AS total

            FROM progreso_lecciones

            WHERE usuario_id = $1
            AND completada = true
            `,

            [
                usuario_id
            ]

        );


    /* =====================================================
       NIVEL 1
       ===================================================== */

    const resultadoNivel1 =
        await db.query(

            `
            SELECT
                COUNT(DISTINCT leccion)::int
                AS total

            FROM progreso_lecciones

            WHERE usuario_id = $1

            AND completada = true

            AND leccion IN
            (
                'hola',
                'adios',
                'mi_nombre',
                'como_te_llamas'
            )
            `,

            [
                usuario_id
            ]

        );


    /* =====================================================
       RACHA
       ===================================================== */

    const resultadoUsuario =
        await db.query(

            `
            SELECT
                COALESCE(racha, 0)::int
                AS racha

            FROM usuarios

            WHERE id = $1
            `,

            [
                usuario_id
            ]

        );


    /* =====================================================
       RETOS
       ===================================================== */

    const resultadoRetos =
        await db.query(

            `
            SELECT
                COUNT(*)::int
                AS total

            FROM retos_diarios

            WHERE usuario_id = $1
            AND completado = true
            `,

            [
                usuario_id
            ]

        );


    /* =====================================================
       COMPRAS
       ===================================================== */

    const resultadoCompras =
        await db.query(

            `
            SELECT
                COUNT(*)::int
                AS total

            FROM compras_tienda

            WHERE usuario_id = $1
            `,

            [
                usuario_id
            ]

        );


    /* =====================================================
       LOGROS QUE YA TENÍA
       ===================================================== */

    const resultadoDesbloqueados =
        await db.query(

            `
            SELECT
                logro_id,
                fecha_desbloqueo

            FROM logros_usuario

            WHERE usuario_id = $1
            `,

            [
                usuario_id
            ]

        );


    /* =====================================================
       DATOS ACTUALES
       ===================================================== */

    const totalLecciones =
        Number(
            resultadoLecciones.rows[0].total
        );


    const nivel1Completadas =
        Number(
            resultadoNivel1.rows[0].total
        );


    const racha =
        Number(
            resultadoUsuario.rows[0]?.racha || 0
        );


    const retosCompletados =
        Number(
            resultadoRetos.rows[0].total
        );


    const compras =
        Number(
            resultadoCompras.rows[0].total
        );


    const desbloqueados =
        new Map(

            resultadoDesbloqueados.rows.map(

                logro => [

                    logro.logro_id,

                    logro.fecha_desbloqueo

                ]

            )

        );


    /* =====================================================
       AQUÍ GUARDAREMOS LOS QUE SE DESBLOQUEEN AHORA
       ===================================================== */

    const nuevosLogros = [];

    const logros = [];


    /* =====================================================
       EVALUAR CATÁLOGO
       ===================================================== */

    for (
        const logro
        of CATALOGO_LOGROS
    ) {

        let progreso = 0;


        switch (
            logro.tipo
        ) {

            case "lecciones":

                progreso =
                    totalLecciones;

                break;


            case "nivel_1":

                progreso =
                    nivel1Completadas;

                break;


            case "racha":

                progreso =
                    racha;

                break;


            case "retos":

                progreso =
                    retosCompletados;

                break;


            case "compras":

                progreso =
                    compras;

                break;
        }


        progreso =
            Math.min(
                progreso,
                logro.objetivo
            );


        let desbloqueado =
            desbloqueados.has(
                logro.id
            );


        /* =================================================
           NUEVO LOGRO
           ================================================= */

        if (
            !desbloqueado &&
            progreso >= logro.objetivo
        ) {

            const resultadoNuevo =
                await db.query(

                    `
                    INSERT INTO logros_usuario
                    (
                        usuario_id,
                        logro_id
                    )

                    VALUES
                    (
                        $1,
                        $2
                    )

                    ON CONFLICT
                    (
                        usuario_id,
                        logro_id
                    )

                    DO NOTHING

                    RETURNING fecha_desbloqueo
                    `,

                    [
                        usuario_id,
                        logro.id
                    ]

                );


            /*
            Solo si INSERT realmente agregó una fila
            significa que se desbloqueó AHORA.
            */

            if (
                resultadoNuevo.rows.length > 0
            ) {

                const fecha =
                    resultadoNuevo
                        .rows[0]
                        .fecha_desbloqueo;


                desbloqueados.set(
                    logro.id,
                    fecha
                );


                desbloqueado =
                    true;


                nuevosLogros.push({

                    id:
                        logro.id,

                    icono:
                        logro.icono,

                    nombre:
                        logro.nombre,

                    descripcion:
                        logro.descripcion

                });

            } else {

                desbloqueado =
                    true;
            }
        }


        logros.push({

            ...logro,

            progreso,

            desbloqueado,

            fecha_desbloqueo:
                desbloqueados.get(
                    logro.id
                ) || null

        });
    }


    return {

        logros,

        nuevosLogros

    };
}

/* =========================================================
   CONSULTAR LOGROS
   ========================================================= */

app.get(
    "/logros",

    autenticarUsuario,

    async (req, res) => {

        try {

            const usuario_id =
                req.usuario.id;


            const {
                logros,
                nuevosLogros
            } =
                await evaluarLogrosUsuario(
                    usuario_id
                );


            const desbloqueados =
                logros.filter(
                    logro =>
                        logro.desbloqueado
                ).length;


            res.json({

                total:
                    logros.length,
                    desbloqueados,
                    logros,

                logros_nuevos:
                    nuevosLogros

            });


        } catch (error) {

            console.error(
                "Error consultando logros:",
                error
            );


            res.status(500).json({

                mensaje:
                    "Error al consultar los logros"

            });
        }
    }
);



/* =========================================================
   INICIALIZACIÓN DEL SERVIDOR
   ========================================================= */

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    () => {

        console.log(
            `Servidor iniciado en puerto ${PORT}`
        );

    }
);