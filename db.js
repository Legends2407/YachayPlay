const {
    Pool
} = require(
    "pg"
);


require(
    "dotenv"
).config();


let configuracion;


/* =========================================================
   PRODUCCIÓN
   ========================================================= */

if (
    process.env.DATABASE_URL
) {

    configuracion = {

        connectionString:
            process.env.DATABASE_URL

    };


/* =========================================================
   LOCAL
   ========================================================= */

} else {

    configuracion = {

        user:
            process.env.DB_USER,

        password:
            process.env.DB_PASSWORD,

        host:
            process.env.DB_HOST,

        port:
            process.env.DB_PORT,

        database:
            process.env.DB_NAME

    };
}


const pool =
    new Pool(
        configuracion
    );


module.exports = pool;