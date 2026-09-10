/* =========================================================
   LECCIONES DE LOS NIVELES 2, 3, 4 Y 5
   ========================================================= */

const LECCIONES = {

    /* =========================================================
   NIVEL 1 - CONOCE A LAS PERSONAS
   ========================================================= */

    hola: {

        nivel: 1,

        icono: "👋",

        nombre: "Hola",

        descripcion:
            "Aprende a saludar en kichwa.",

        titulo:
            "👋 Aprende a saludar",

        introduccion:
            "En kichwa, una forma común de saludar es:",

        frase:
            "Alli puncha",

        pronunciacion:
            "Alli puncha",

        significado:
            "Hola / Buenos días",

        mensajeKuntur:
            "En kichwa, una forma común de decir hola es Alli puncha.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Hola" en kichwa?',

                opciones: [
                    "Alli puncha",
                    "Tupananchiskama",
                    "Yupaychani",
                    "Ñuka"
                ],

                correcta:
                    "Alli puncha",

                mensajeCorrecto:
                    "Alli puncha significa Hola. ¡Lo hiciste muy bien!"
            },

            {
                pregunta:
                    '¿Qué significa "Alli puncha"?',

                opciones: [
                    "Gracias",
                    "Hola",
                    "Adiós",
                    "Mi nombre es"
                ],

                correcta:
                    "Hola",

                mensajeCorrecto:
                    "¡Correcto! Alli puncha se utiliza para saludar."
            },

            {
                pregunta:
                    "Selecciona la palabra correcta para saludar.",

                opciones: [
                    "Yupaychani",
                    "Ñuka",
                    "Alli puncha",
                    "Tata"
                ],

                correcta:
                    "Alli puncha",

                mensajeCorrecto:
                    "¡Muy bien! Alli puncha es una forma de saludar."
            }

        ]
    },


    adios: {

        nivel: 1,

        icono: "👋",

        nombre: "Adiós",

        descripcion:
            "Aprende a despedirte.",

        titulo:
            "👋 Aprende a despedirte",

        introduccion:
            "En kichwa, una forma de despedirse es:",

        frase:
            "Tupananchiskama",

        pronunciacion:
            "Tupananchiskama",

        significado:
            "Hasta luego / Adiós",

        mensajeKuntur:
            "En kichwa podemos decir Tupananchiskama cuando nos despedimos de una persona.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Adiós" en kichwa?',

                opciones: [
                    "Tupananchiskama",
                    "Alli puncha",
                    "Yupaychani",
                    "Ñuka"
                ],

                correcta:
                    "Tupananchiskama",

                mensajeCorrecto:
                    "Tupananchiskama se utiliza para despedirse. ¡Muy bien!"
            },

            {
                pregunta:
                    '¿Qué significa "Tupananchiskama"?',

                opciones: [
                    "Hola",
                    "Gracias",
                    "Hasta luego / Adiós",
                    "Mi nombre es"
                ],

                correcta:
                    "Hasta luego / Adiós"
            },

            {
                pregunta:
                    "Selecciona la expresión correcta para despedirte.",

                opciones: [
                    "Alli puncha",
                    "Tupananchiskama",
                    "Yupaychani",
                    "Ñuka"
                ],

                correcta:
                    "Tupananchiskama"
            }

        ]
    },


    mi_nombre: {

        nivel: 1,

        icono: "🙋",

        nombre: "Mi nombre es...",

        descripcion:
            "Aprende a presentarte.",

        titulo:
            "🙋 Aprende a presentarte",

        introduccion:
            "En kichwa, para decir tu nombre puedes utilizar:",

        frase:
            "Ñuka shuti Ana kan",

        pronunciacion:
            "Ñuka shuti Ana kan",

        significado:
            "Mi nombre es Ana",

        mensajeKuntur:
            "Ñuka shuti Ana kan significa Mi nombre es Ana. Puedes cambiar Ana por tu propio nombre.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Mi nombre es Ana" en kichwa?',

                opciones: [
                    "Ñuka shuti Ana kan",
                    "Ima shuti kanki?",
                    "Alli puncha",
                    "Tupananchiskama"
                ],

                correcta:
                    "Ñuka shuti Ana kan",

                mensajeCorrecto:
                    "Ñuka shuti Ana kan significa Mi nombre es Ana. ¡Muy bien!"
            },

            {
                pregunta:
                    '¿Qué significa "Ñuka shuti Ana kan"?',

                opciones: [
                    "¿Cómo te llamas?",
                    "Mi nombre es Ana",
                    "Hola",
                    "Adiós"
                ],

                correcta:
                    "Mi nombre es Ana"
            },

            {
                pregunta:
                    "Selecciona la expresión correcta para presentarte.",

                opciones: [
                    "Alli puncha",
                    "Tupananchiskama",
                    "Ñuka shuti Ana kan",
                    "Ima shuti kanki?"
                ],

                correcta:
                    "Ñuka shuti Ana kan"
            }

        ]
    },


    como_te_llamas: {

        nivel: 1,

        icono: "❓",

        nombre: "¿Cómo te llamas?",

        descripcion:
            "Aprende a preguntar el nombre.",

        titulo:
            "❓ Aprende a preguntar el nombre",

        introduccion:
            "En kichwa, para preguntar el nombre de una persona puedes decir:",

        frase:
            "Ima shuti kanki?",

        pronunciacion:
            "Ima shuti kanki",

        significado:
            "¿Cómo te llamas?",

        mensajeKuntur:
            "Ima shuti kanki? se utiliza para preguntarle a una persona cómo se llama.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "¿Cómo te llamas?" en kichwa?',

                opciones: [
                    "Ima shuti kanki?",
                    "Ñuka shuti Ana kan",
                    "Alli puncha",
                    "Tupananchiskama"
                ],

                correcta:
                    "Ima shuti kanki?",

                mensajeCorrecto:
                    "Ima shuti kanki? significa ¿Cómo te llamas? ¡Muy bien!"
            },

            {
                pregunta:
                    '¿Qué significa "Ima shuti kanki?"?',

                opciones: [
                    "¿Cómo te llamas?",
                    "Mi nombre es Ana",
                    "Hola",
                    "Adiós"
                ],

                correcta:
                    "¿Cómo te llamas?"
            },

            {
                pregunta:
                    "Selecciona la expresión correcta para preguntar el nombre de una persona.",

                opciones: [
                    "Tupananchiskama",
                    "Alli puncha",
                    "Ima shuti kanki?",
                    "Ñuka shuti Ana kan"
                ],

                correcta:
                    "Ima shuti kanki?"
            }

        ]
    },


    /* =====================================================
       NIVEL 2 - MI FAMILIA
       ===================================================== */

    familia: {

        nivel: 2,

        icono: "👨‍👩‍👧‍👦",

        nombre: "Familia",

        descripcion:
            "Aprende cómo se dice familia en kichwa.",

        titulo:
            "👨‍👩‍👧‍👦 Aprende a decir familia",

        introduccion:
            "En kichwa, familia se dice:",

        frase:
            "Ayllu",

        pronunciacion:
            "Ayllu",

        significado:
            "Familia",

        mensajeKuntur:
            "Ayllu significa familia. Es una palabra muy importante dentro de la cultura kichwa.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Familia" en kichwa?',

                opciones: [
                    "Ayllu",
                    "Yaya",
                    "Mama",
                    "Allku"
                ],

                correcta:
                    "Ayllu"
            },

            {
                pregunta:
                    '¿Qué significa "Ayllu"?',

                opciones: [
                    "Familia",
                    "Padre",
                    "Madre",
                    "Perro"
                ],

                correcta:
                    "Familia"
            },

            {
                pregunta:
                    "Selecciona la palabra que representa a la familia.",

                opciones: [
                    "Mama",
                    "Ayllu",
                    "Yaya",
                    "Misi"
                ],

                correcta:
                    "Ayllu"
            }

        ]
    },


    padre: {

        nivel: 2,

        icono: "👨",

        nombre: "Papá",

        descripcion:
            "Aprende cómo se dice papá.",

        titulo:
            "👨 Aprende a decir papá",

        introduccion:
            "En kichwa, una forma de decir papá o padre es:",

        frase:
            "Yaya",

        pronunciacion:
            "Yaya",

        significado:
            "Papá / Padre",

        mensajeKuntur:
            "Yaya se utiliza para referirse al padre o papá.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Papá" en kichwa?',

                opciones: [
                    "Yaya",
                    "Mama",
                    "Ayllu",
                    "Wawki"
                ],

                correcta:
                    "Yaya"
            },

            {
                pregunta:
                    '¿Qué significa "Yaya"?',

                opciones: [
                    "Hermano",
                    "Padre / Papá",
                    "Madre",
                    "Familia"
                ],

                correcta:
                    "Padre / Papá"
            },

            {
                pregunta:
                    "Selecciona la palabra relacionada con el padre.",

                opciones: [
                    "Mama",
                    "Yaya",
                    "Turi",
                    "Ayllu"
                ],

                correcta:
                    "Yaya"
            }

        ]
    },


    madre: {

        nivel: 2,

        icono: "👩",

        nombre: "Mamá",

        descripcion:
            "Aprende cómo se dice mamá.",

        titulo:
            "👩 Aprende a decir mamá",

        introduccion:
            "En kichwa, mamá o madre se dice:",

        frase:
            "Mama",

        pronunciacion:
            "Mama",

        significado:
            "Mamá / Madre",

        mensajeKuntur:
            "Mama significa mamá o madre.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Mamá" en kichwa?',

                opciones: [
                    "Mama",
                    "Yaya",
                    "Ayllu",
                    "Wawki"
                ],

                correcta:
                    "Mama"
            },

            {
                pregunta:
                    '¿Qué significa "Mama"?',

                opciones: [
                    "Padre",
                    "Familia",
                    "Madre / Mamá",
                    "Hermano"
                ],

                correcta:
                    "Madre / Mamá"
            },

            {
                pregunta:
                    "Selecciona la palabra relacionada con la madre.",

                opciones: [
                    "Yaya",
                    "Mama",
                    "Turi",
                    "Ayllu"
                ],

                correcta:
                    "Mama"
            }

        ]
    },


    hermano: {

        nivel: 2,

        icono: "👦",

        nombre: "Hermano",

        descripcion:
            "Aprende formas de decir hermano.",

        titulo:
            "👦 Aprende a decir hermano",

        introduccion:
            "En kichwa existen formas distintas según quién habla:",

        frase:
            "Wawki / Turi",

        pronunciacion:
            "Wawki Turi",

        significado:
            "Hermano",

        mensajeKuntur:
            "Wawki es hermano de hermano. Turi es hermano de hermana.",

        preguntas: [

            {
                pregunta:
                    "¿Cómo llama un hombre a su hermano?",

                opciones: [
                    "Wawki",
                    "Turi",
                    "Mama",
                    "Yaya"
                ],

                correcta:
                    "Wawki"
            },

            {
                pregunta:
                    "¿Cómo llama una mujer a su hermano?",

                opciones: [
                    "Yaya",
                    "Turi",
                    "Ayllu",
                    "Mama"
                ],

                correcta:
                    "Turi"
            },

            {
                pregunta:
                    "¿Qué relación representan Wawki y Turi?",

                opciones: [
                    "Madre",
                    "Padre",
                    "Hermano",
                    "Abuelo"
                ],

                correcta:
                    "Hermano"
            }

        ]
    },



    /* =====================================================
       NIVEL 3 - LOS NÚMEROS
       ===================================================== */

    numero_1_2: {

        nivel: 3,

        icono: "1️⃣",

        nombre: "Uno y dos",

        descripcion:
            "Aprende los primeros números.",

        titulo:
            "🔢 Aprende uno y dos",

        introduccion:
            "Los primeros números en kichwa son:",

        frase:
            "Shuk - Ishkay",

        pronunciacion:
            "Shuk Ishkay",

        significado:
            "Uno - Dos",

        mensajeKuntur:
            "Shuk significa uno e Ishkay significa dos.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Uno" en kichwa?',

                opciones: [
                    "Shuk",
                    "Ishkay",
                    "Kimsa",
                    "Chusku"
                ],

                correcta:
                    "Shuk"
            },

            {
                pregunta:
                    '¿Cómo se dice "Dos" en kichwa?',

                opciones: [
                    "Kimsa",
                    "Ishkay",
                    "Shuk",
                    "Pichka"
                ],

                correcta:
                    "Ishkay"
            },

            {
                pregunta:
                    "Selecciona el orden correcto de uno y dos.",

                opciones: [
                    "Ishkay - Shuk",
                    "Shuk - Ishkay",
                    "Kimsa - Chusku",
                    "Pichka - Sukta"
                ],

                correcta:
                    "Shuk - Ishkay"
            }

        ]
    },


    numero_3_4: {

        nivel: 3,

        icono: "3️⃣",

        nombre: "Tres y cuatro",

        descripcion:
            "Continúa aprendiendo los números.",

        titulo:
            "🔢 Aprende tres y cuatro",

        introduccion:
            "En kichwa, tres y cuatro se dicen:",

        frase:
            "Kimsa - Chusku",

        pronunciacion:
            "Kimsa Chusku",

        significado:
            "Tres - Cuatro",

        mensajeKuntur:
            "Kimsa significa tres y Chusku significa cuatro.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Tres" en kichwa?',

                opciones: [
                    "Kimsa",
                    "Chusku",
                    "Pichka",
                    "Sukta"
                ],

                correcta:
                    "Kimsa"
            },

            {
                pregunta:
                    '¿Cómo se dice "Cuatro" en kichwa?',

                opciones: [
                    "Ishkay",
                    "Kimsa",
                    "Chusku",
                    "Shuk"
                ],

                correcta:
                    "Chusku"
            },

            {
                pregunta:
                    "Selecciona el orden correcto de tres y cuatro.",

                opciones: [
                    "Chusku - Kimsa",
                    "Kimsa - Chusku",
                    "Shuk - Ishkay",
                    "Pichka - Sukta"
                ],

                correcta:
                    "Kimsa - Chusku"
            }

        ]
    },


    numero_5_6: {

        nivel: 3,

        icono: "5️⃣",

        nombre: "Cinco y seis",

        descripcion:
            "Aprende cinco y seis.",

        titulo:
            "🔢 Aprende cinco y seis",

        introduccion:
            "En kichwa, cinco y seis se dicen:",

        frase:
            "Pichka - Sukta",

        pronunciacion:
            "Pichka Sukta",

        significado:
            "Cinco - Seis",

        mensajeKuntur:
            "Pichka significa cinco y Sukta significa seis.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Cinco" en kichwa?',

                opciones: [
                    "Pichka",
                    "Sukta",
                    "Kanchis",
                    "Kimsa"
                ],

                correcta:
                    "Pichka"
            },

            {
                pregunta:
                    '¿Cómo se dice "Seis" en kichwa?',

                opciones: [
                    "Pichka",
                    "Chusku",
                    "Sukta",
                    "Pusak"
                ],

                correcta:
                    "Sukta"
            },

            {
                pregunta:
                    "Selecciona el orden correcto de cinco y seis.",

                opciones: [
                    "Sukta - Pichka",
                    "Pichka - Sukta",
                    "Kimsa - Chusku",
                    "Kanchis - Pusak"
                ],

                correcta:
                    "Pichka - Sukta"
            }

        ]
    },


    numero_7_10: {

        nivel: 3,

        icono: "🔟",

        nombre: "Del siete al diez",

        descripcion:
            "Completa los números del 1 al 10.",

        titulo:
            "🔢 Aprende del siete al diez",

        introduccion:
            "Los números del siete al diez son:",

        frase:
            "Kanchis - Pusak - Iskun - Chunka",

        pronunciacion:
            "Kanchis Pusak Iskun Chunka",

        significado:
            "Siete - Ocho - Nueve - Diez",

        mensajeKuntur:
            "Kanchis es siete, Pusak es ocho, Iskun es nueve y Chunka es diez.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Siete" en kichwa?',

                opciones: [
                    "Kanchis",
                    "Pusak",
                    "Iskun",
                    "Chunka"
                ],

                correcta:
                    "Kanchis"
            },

            {
                pregunta:
                    '¿Cómo se dice "Ocho" en kichwa?',

                opciones: [
                    "Iskun",
                    "Pusak",
                    "Chunka",
                    "Sukta"
                ],

                correcta:
                    "Pusak"
            },

            {
                pregunta:
                    "¿Cómo se dicen nueve y diez?",

                opciones: [
                    "Pusak - Iskun",
                    "Iskun - Chunka",
                    "Kanchis - Pusak",
                    "Sukta - Kanchis"
                ],

                correcta:
                    "Iskun - Chunka"
            }

        ]
    },



    /* =====================================================
       NIVEL 4 - LOS COLORES
       ===================================================== */

    color_rojo: {

        nivel: 4,

        icono: "🔴",

        nombre: "Rojo",

        descripcion:
            "Aprende el color rojo.",

        titulo:
            "🔴 Aprende el color rojo",

        introduccion:
            "En kichwa, rojo se dice:",

        frase:
            "Puka",

        pronunciacion:
            "Puka",

        significado:
            "Rojo",

        mensajeKuntur:
            "Puka significa rojo.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Rojo" en kichwa?',

                opciones: [
                    "Puka",
                    "Killu",
                    "Waylla",
                    "Yana"
                ],

                correcta:
                    "Puka"
            },

            {
                pregunta:
                    '¿Qué significa "Puka"?',

                opciones: [
                    "Verde",
                    "Rojo",
                    "Amarillo",
                    "Negro"
                ],

                correcta:
                    "Rojo"
            },

            {
                pregunta:
                    "Selecciona la palabra kichwa para el color rojo.",

                opciones: [
                    "Yana",
                    "Waylla",
                    "Puka",
                    "Killu"
                ],

                correcta:
                    "Puka"
            }

        ]
    },


    color_amarillo: {

        nivel: 4,

        icono: "🟡",

        nombre: "Amarillo",

        descripcion:
            "Aprende el color amarillo.",

        titulo:
            "🟡 Aprende el color amarillo",

        introduccion:
            "En kichwa, amarillo se dice:",

        frase:
            "Killu",

        pronunciacion:
            "Killu",

        significado:
            "Amarillo",

        mensajeKuntur:
            "Killu significa amarillo.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Amarillo" en kichwa?',

                opciones: [
                    "Killu",
                    "Puka",
                    "Waylla",
                    "Yurak"
                ],

                correcta:
                    "Killu"
            },

            {
                pregunta:
                    '¿Qué significa "Killu"?',

                opciones: [
                    "Amarillo",
                    "Rojo",
                    "Verde",
                    "Blanco"
                ],

                correcta:
                    "Amarillo"
            },

            {
                pregunta:
                    "Selecciona la palabra kichwa para amarillo.",

                opciones: [
                    "Puka",
                    "Yana",
                    "Killu",
                    "Waylla"
                ],

                correcta:
                    "Killu"
            }

        ]
    },


    color_verde: {

        nivel: 4,

        icono: "🟢",

        nombre: "Verde",

        descripcion:
            "Aprende el color verde.",

        titulo:
            "🟢 Aprende el color verde",

        introduccion:
            "En kichwa, verde se dice:",

        frase:
            "Waylla",

        pronunciacion:
            "Waylla",

        significado:
            "Verde",

        mensajeKuntur:
            "Waylla significa verde.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Verde" en kichwa?',

                opciones: [
                    "Waylla",
                    "Puka",
                    "Killu",
                    "Yana"
                ],

                correcta:
                    "Waylla"
            },

            {
                pregunta:
                    '¿Qué significa "Waylla"?',

                opciones: [
                    "Negro",
                    "Verde",
                    "Rojo",
                    "Amarillo"
                ],

                correcta:
                    "Verde"
            },

            {
                pregunta:
                    "Selecciona la palabra kichwa para verde.",

                opciones: [
                    "Killu",
                    "Waylla",
                    "Puka",
                    "Yurak"
                ],

                correcta:
                    "Waylla"
            }

        ]
    },


    color_blanco_negro: {

        nivel: 4,

        icono: "⚫",

        nombre: "Blanco y negro",

        descripcion:
            "Aprende blanco y negro.",

        titulo:
            "⚫⚪ Aprende blanco y negro",

        introduccion:
            "En kichwa, estos colores se dicen:",

        frase:
            "Yana - Yurak",

        pronunciacion:
            "Yana Yurak",

        significado:
            "Negro - Blanco",

        mensajeKuntur:
            "Yana significa negro y Yurak significa blanco.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Negro" en kichwa?',

                opciones: [
                    "Yana",
                    "Yurak",
                    "Puka",
                    "Killu"
                ],

                correcta:
                    "Yana"
            },

            {
                pregunta:
                    '¿Cómo se dice "Blanco" en kichwa?',

                opciones: [
                    "Waylla",
                    "Yurak",
                    "Yana",
                    "Puka"
                ],

                correcta:
                    "Yurak"
            },

            {
                pregunta:
                    "Selecciona el orden correcto para negro y blanco.",

                opciones: [
                    "Yurak - Yana",
                    "Yana - Yurak",
                    "Puka - Killu",
                    "Waylla - Puka"
                ],

                correcta:
                    "Yana - Yurak"
            }

        ]
    },



    /* =====================================================
       NIVEL 5 - LOS ANIMALES
       ===================================================== */

    perro: {

        nivel: 5,

        icono: "🐕",

        nombre: "Perro",

        descripcion:
            "Aprende cómo se dice perro.",

        titulo:
            "🐕 Aprende la palabra perro",

        introduccion:
            "En kichwa, perro se dice:",

        frase:
            "Allku",

        pronunciacion:
            "Allku",

        significado:
            "Perro",

        mensajeKuntur:
            "Allku significa perro.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Perro" en kichwa?',

                opciones: [
                    "Allku",
                    "Misi",
                    "Wakra",
                    "Kuntur"
                ],

                correcta:
                    "Allku"
            },

            {
                pregunta:
                    '¿Qué significa "Allku"?',

                opciones: [
                    "Gato",
                    "Cóndor",
                    "Perro",
                    "Vaca"
                ],

                correcta:
                    "Perro"
            },

            {
                pregunta:
                    "Selecciona la palabra kichwa para perro.",

                opciones: [
                    "Misi",
                    "Allku",
                    "Wakra",
                    "Kuntur"
                ],

                correcta:
                    "Allku"
            }

        ]
    },


    gato: {

        nivel: 5,

        icono: "🐈",

        nombre: "Gato",

        descripcion:
            "Aprende cómo se dice gato.",

        titulo:
            "🐈 Aprende la palabra gato",

        introduccion:
            "En kichwa, gato se dice:",

        frase:
            "Misi",

        pronunciacion:
            "Misi",

        significado:
            "Gato",

        mensajeKuntur:
            "Misi significa gato.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Gato" en kichwa?',

                opciones: [
                    "Misi",
                    "Allku",
                    "Wakra",
                    "Kuntur"
                ],

                correcta:
                    "Misi"
            },

            {
                pregunta:
                    '¿Qué significa "Misi"?',

                opciones: [
                    "Gato",
                    "Perro",
                    "Vaca",
                    "Cóndor"
                ],

                correcta:
                    "Gato"
            },

            {
                pregunta:
                    "Selecciona la palabra kichwa para gato.",

                opciones: [
                    "Allku",
                    "Wakra",
                    "Misi",
                    "Kuntur"
                ],

                correcta:
                    "Misi"
            }

        ]
    },


    vaca: {

        nivel: 5,

        icono: "🐄",

        nombre: "Vaca",

        descripcion:
            "Aprende cómo se dice vaca.",

        titulo:
            "🐄 Aprende la palabra vaca",

        introduccion:
            "En kichwa, vaca se dice:",

        frase:
            "Wakra",

        pronunciacion:
            "Wakra",

        significado:
            "Vaca",

        mensajeKuntur:
            "Wakra significa vaca.",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Vaca" en kichwa?',

                opciones: [
                    "Wakra",
                    "Misi",
                    "Allku",
                    "Kuntur"
                ],

                correcta:
                    "Wakra"
            },

            {
                pregunta:
                    '¿Qué significa "Wakra"?',

                opciones: [
                    "Perro",
                    "Vaca",
                    "Gato",
                    "Cóndor"
                ],

                correcta:
                    "Vaca"
            },

            {
                pregunta:
                    "Selecciona la palabra kichwa para vaca.",

                opciones: [
                    "Kuntur",
                    "Allku",
                    "Wakra",
                    "Misi"
                ],

                correcta:
                    "Wakra"
            }

        ]
    },


    condor: {

        nivel: 5,

        icono: "🦅",

        nombre: "Cóndor",

        descripcion:
            "Aprende cómo se dice cóndor.",

        titulo:
            "🦅 Aprende la palabra cóndor",

        introduccion:
            "En kichwa, cóndor se dice:",

        frase:
            "Kuntur",

        pronunciacion:
            "Kuntur",

        significado:
            "Cóndor",

        mensajeKuntur:
            "Kuntur significa cóndor. ¡También es el nombre de nuestra mascota!",

        preguntas: [

            {
                pregunta:
                    '¿Cómo se dice "Cóndor" en kichwa?',

                opciones: [
                    "Kuntur",
                    "Allku",
                    "Misi",
                    "Wakra"
                ],

                correcta:
                    "Kuntur"
            },

            {
                pregunta:
                    '¿Qué significa "Kuntur"?',

                opciones: [
                    "Vaca",
                    "Gato",
                    "Cóndor",
                    "Perro"
                ],

                correcta:
                    "Cóndor"
            },

            {
                pregunta:
                    "¿Cuál es también el nombre de la mascota de YachayPlay?",

                opciones: [
                    "Allku",
                    "Misi",
                    "Wakra",
                    "Kuntur"
                ],

                correcta:
                    "Kuntur"
            }

        ]
    }

};