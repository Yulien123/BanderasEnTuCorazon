/* Se pide:
-Lista de paises y su ciudad capital
-Banderas de esos paises
- Paises limitrofes(cantidad de un pais)
- Inventar alguna pregunta(?) como en que continente esta cierto pais

¿Cual es el país de la siguiente ciudad capital? (3 puntos) 
¿El país xx esta representado por la siguiente bandera? (5 puntos) 
¿Cuantos países limítrofes tiene el siguiente país? (3 puntos)

const URL_ALL = "https://restcountries.com/v3.1/all?fields=name,capital,borders,flags,continents,translations"
const URL_PAISES = "https://restcountries.com/v3.1/all?fields=name"
const URL_CAPITALES = "https://restcountries.com/v3.1/all?fields=name,capital"
const URL_LIMITROFES = "https://restcountries.com/v3.1/all?fields=name,borders"
const URL_BANDERAS = "https://restcountries.com/v3.1/all?fields=name,flags"
const URL_CONTINENTES = "https://restcountries.com/v3.1/all?fields=name,continents"
*/
// US1: pueden tocar 3 tipos diferentes de preguntas (x 10 Preguntas)
// US2: Puedo seleccionar una respuesta entre 4 opciones 

// Arreglo de preguntas y respuestas
const preguntas = [
    { pregunta: "¿Cual es el país de la siguiente ciudad capital?",
      respuestas: [
        { respuesta: "res 1", correcta: true }, // Respuesta correctaa
        { respuesta: "res 2", correcta: false },
        { respuesta: "res 3", correcta: false },
        { respuesta: "res 4", correcta: false }
    ]},
    { pregunta: "¿El país xx esta representado por la siguiente bandera?",
      respuestas: [
        { respuesta: "res 1", correcta: false },
        { respuesta: "res 2", correcta: true }, // Respuesta correctaa
        { respuesta: "res 3", correcta: false },
        { respuesta: "res 4", correcta: false }
    ]},
    { pregunta: "¿Cuantos países limítrofes tiene el siguiente país?",
      respuestas: [
        { respuesta: "res 1", correcta: false },
        { respuesta: "res 2", correcta: true }, // Respuesta correctaa
        { respuesta: "res 3", correcta: false },
        { respuesta: "res 4", correcta: false }
    ]}
]

// Elementos del DOM
const preguntaElement = document.getElementById("pregunta") // Elemento que muestra la pregunta actual
const respuestaButtons = document.getElementById("respuestas-buttons") // Contenedor de botones de respuestas

// Variables para el cuestionario
let preguntaActualIndex = 0 // índice de la pregunta actual 

// función para inicia el cuestionario
function comenzarCuestionario() {
    mostrarPregunta() // Mostrar la primera pregunta
}

// función para mostrar la pregunta actual
function mostrarPregunta() {
    // Obtener la pregunta actual del arreglo
    const preguntaActual = preguntas[preguntaActualIndex] // Obtener la pregunta actual del arreglo
    preguntaElement.innerHTML = `${preguntaActualIndex + 1}. ${preguntaActual.pregunta}` // Mostrar el nro de pregunta y pregunta en el DOM

    // Crear los botones de respuesta dinámicamente
    preguntaActual.respuestas.forEach(crearBotonRespuesta);
}

// Funcion para crear botones de respuestas
function crearBotonRespuesta(respuesta) {
    const boton = document.createElement("button"); // Crear un botón HTML
    boton.innerHTML = respuesta.respuesta; // Asigna el texto de la respuesta
    boton.classList.add("btn"); // Agrega una clase al botón
    respuestaButtons.appendChild(boton); // Agregar el botón al contenedor de respuestas
}

/*
//funcion de prueba: Fetch a la API de los paises y mostrar en consola el nombre de los paises
async function cargarPaises() {
    console.log('Cargando países...');

    try {
        // Fetch a la API
        const response = await fetch(URL_ALL);
        const data = await response.json();

        // Obtener un país aleatorio
        const paises = data[Math.floor(Math.random() * data.length)];
        console.log(paises);
        // Validaciones seguras antes de acceder a propiedades
        const pais = paises.name?.common ?? "Desconocido";
        //const paisTranslate = paises.translations.spa.common ?? pais   // conviene traducir la api.
        const capital = paises.capital?.[0] ?? "Desconocida";
        const bandera = paises.flags?.png ?? "";
        const limitrofes = paises.borders?.length > 0 ? paises.borders.join(", ") : "Ninguno";
        const cant_limitrofes = paises.borders?.length > 0 ? paises.borders.length : 0;
        const continente = paises.continents?.[0] ?? "Desconocido";

        // Traducir los datos del país.
        const paisTraducido = await traducirTexto(pais);
        const capitalTraducida = await traducirTexto(capital);
        const continenteTraducido = await traducirTexto(continente);


        // Crear elemento y mostrar los datos
        const contenedor = document.getElementById("resultados");
        const divPaises = document.createElement("div");
        divPaises.classList.add("paises");
        divPaises.innerHTML = `
        <img src="${bandera}" alt="Bandera de ${pais}">
        <div>
            <h3><strong>${paisTraducido}</strong></h3><br>
            <h4>Capital: ${capitalTraducida}</h4>
            <h4>Continente: ${continenteTraducido}</h4>
            <h4>Países limítrofes (${cant_limitrofes}): ${limitrofes}</h4>
        </div>`;
        contenedor.appendChild(divPaises);

    } catch (error) {
        console.error("Error al cargar los países:", error);
    }
}

// Función para traducir texto de la API
async function traducirTexto(texto) {
    try {
        const response = await fetch('/traducir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto })
        });

        if (!response.ok) {
            throw new Error('Error en la traducción');
        }

        const data = await response.json();
        return data.traduccion;
    } catch (error) {
        console.error("Error al traducir el texto:", error);
        return texto;
    }
}*/

comenzarCuestionario()

console.log('Script cargado...')