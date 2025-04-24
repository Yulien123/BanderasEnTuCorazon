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
// US3: Cuando yo respondo correctamente la aplicación me lo dice y puedo moverme a la siguiente pregunta. 
// US4: Cuando yo respondo incorrectamente la aplicación me índica del error, me dice cual es la respuesta correcta y puedo continuar con otra pregunta. 
/*US5: Cuando termino de contestar las preguntas (10 en total),
       el sistema me brinda información sobre:
                - la cantidad de preguntas respondidas correcta e incorrectamente, 
                -la duración total de la partida 
                -y el tiempo promedio tardado en responder cada pregunta.  */
                
// buscar la forma de que las respuestas las sirva por pantalla con un orden aleatorio.
// tambien la forma en servir las preguntas de forma aleatoria. o hacer 10 preguntas o 3 aleatorias de cada tipo hasta llegar a 10.

// Arreglo de preguntas y respuestas
const preguntas = [
    {
        pregunta: "¿Cual es el país de la siguiente ciudad capital?",
        respuestas: [
            { respuesta: "res 1", correcta: true }, // Respuesta correctaa
            { respuesta: "res 2", correcta: false },
            { respuesta: "res 3", correcta: false },
            { respuesta: "res 4", correcta: false }
        ]
    },
    {
        pregunta: "¿El país xx esta representado por la siguiente bandera?",
        respuestas: [
            { respuesta: "res 1", correcta: false },
            { respuesta: "res 2", correcta: true }, // Respuesta correctaa
            { respuesta: "res 3", correcta: false },
            { respuesta: "res 4", correcta: false }
        ]
    },
    {
        pregunta: "¿Cuantos países limítrofes tiene el siguiente país?",
        respuestas: [
            { respuesta: "res 1", correcta: false },
            { respuesta: "res 2", correcta: true }, // Respuesta correctaa
            { respuesta: "res 3", correcta: false },
            { respuesta: "res 4", correcta: false }
        ]
    }
]

// Elementos del DOM
const preguntaElement = document.getElementById("pregunta") // Elemento que muestra la pregunta actual
const respuestaButtons = document.getElementById("respuestas-buttons") // Contenedor de botones de respuestas
const siguienteButton = document.getElementById("siguiente-btn") // Elemento del botón "Siguiente"
const avisoElement = document.getElementById("aviso");

// Variables para el cuestionario
let preguntaActualIndex = 0 // índice de la pregunta actual 
let cant_correctas = 0 // contador de respuestas correctas
let cant_incorrectas = 0 // contador de respuestas incorrectas
let tiempoInicio, tiempoFin; // Variables para medir el tiempo de la partida
let tiemposRespuestas = []; // Arreglo para almacenar los tiempos de respuesta
let timepoInicioPregunta; // Variable para almacenar el tiempo de inicio de la pregunta actual

// función para inicia el cuestionario
function comenzarCuestionario() {
    console.log('\n---Inicia el juego---');

    tiempoInicio = Date.now(); // Guardar el tiempo de inicio
    preguntaActualIndex = 0 // Reiniciar el índice de la pregunta actual
    cant_correctas = 0 // Reiniciar el contador de respuestas correctas
    cant_incorrectas = 0 // Reiniciar el contador de respuestas incorrectas
    avisoElement.innerHTML = ""; // Limpiar el aviso de respuesta correcta o incorrecta
    siguienteButton.innerHTML = "Siguiente" // Cambia el texto del botón a "Siguiente"

    mostrarPregunta() // Mostrar la primera pregunta
}

// función para mostrar la pregunta actual
function mostrarPregunta() {
    console.log('---Muestra la pregunta ---');
    reiniciar() // Limpiar respuestas anteriores y ocultar el botón "Siguiente"
    
    timepoInicioPregunta = Date.now(); // Guardar el tiempo de inicio de la pregunta actual
    
    // Obtener la pregunta actual del arreglo
    const preguntaActual = preguntas[preguntaActualIndex] // Obtener la pregunta actual del arreglo
    preguntaElement.innerHTML = `${preguntaActualIndex + 1}. ${preguntaActual.pregunta}` // Mostrar el nro de pregunta y pregunta en el DOM

    // Crear los botones de respuesta dinámicamente
    preguntaActual.respuestas.forEach(crearBotonRespuesta);
}

// Funcion para crear botones de respuestas
function crearBotonRespuesta(respuesta) {
    console.log('---Creando botones de respuestas---')
    const boton = document.createElement("button"); // Crear un botón HTML
    boton.innerHTML = respuesta.respuesta; // Asigna el texto de la respuesta
    boton.classList.add("btn"); // Agrega una clase al botón
    respuestaButtons.appendChild(boton); // Agregar el botón al contenedor de respuestas

    // Una vez que el usuario selecciona una respuesta, se llama a la función seleccionarRespuesta
    // y se le pasa el botón como argumento
    boton.dataset.correcta = respuesta.correcta || false; // Almacena ANTES de seccionar, si la respuesta es correcta o no en un atributo de datos del botón
    boton.addEventListener("click", seleccionarRespuesta); // Agregar un evento de clic al botón y le pasa la funcion seleccionarRespuesta
}

// Funcion para manejar la selección de respuesta
function seleccionarRespuesta(e) {
    console.log('¡Respuesta seleccionada!');
    const botonSeleccionado = e.target; // Obtener el botón que fue clickeado

    // Guardar el tiempo de respuesta
    let tiempoFinRespuesta = Date.now(); // Guardar el tiempo de fin de la respuesta
    let tiempoRespuesta = (tiempoFinRespuesta - timepoInicioPregunta) / 1000; // Calcular el tiempo de respuesta en segundos
    tiemposRespuestas.push(tiempoRespuesta); // Almacenar el tiempo de respuesta en el arreglo
    

    // muestra el aviso de respuesta correcta o incorrecta 
    if (botonSeleccionado.dataset.correcta === 'true') {
        botonSeleccionado.classList.add("correcta") // Agregar clase correcta solo si la respuesta es correcta
        avisoElement.innerHTML = "¡Correcto! 🎉"
        cant_correctas++; // Incrementar el contador de respuestas correctas
    } else {
        botonSeleccionado.classList.add("incorrecta"); // Agregar clase incorrecta solo si la respuesta es incorrecta
        const respuestaCorrecta = preguntas[preguntaActualIndex].respuestas.find(r => r.correcta); // Buscar la respuesta correcta
        avisoElement.innerHTML = `Incorrecto ❌. La respuesta correcta era: ${respuestaCorrecta.respuesta}`;
        cant_incorrectas++; // Incrementar el contador de respuestas incorrectas

        // Resaltar el botón de la respuesta correcta en verde
        Array.from(respuestaButtons.children).forEach(boton => {
            if (boton.innerHTML === respuestaCorrecta.respuesta) {
                boton.classList.add("correcta"); // Agregar clase correcta al botón de la respuesta correcta
            }
            boton.disabled = true; // Deshabilitar los botones no seleccionados
        });
    }

    siguienteButton.style.display = "block"; // Mostrar el botón "Siguiente"
    console.log(`Esta respuesta es: ${botonSeleccionado.dataset.correcta}, Tardó: ${tiempoRespuesta.toFixed(2)} segundos`); // Mostrar en consola si la respuesta es correcta o incorrecta y el tiempo de respuesta
}


// Funcion para limpiar respuestas anteriores y ocultar el btn siguiente
function reiniciar() {
    console.log('---Reiniciando el cuestionario---')
    siguienteButton.style.display = "none"; // Ocultar el botón "Siguiente"
    respuestaButtons.innerHTML = ""; // Limpiar el contenedor de respuestas
    avisoElement.innerHTML = ""; // Limpiar el aviso de respuesta correcta o incorrecta
    preguntaElement.innerHTML = ""; // Limpiar el texto de la pregunta
}

// Funcion para manejar el clic en el botón "Siguiente"
function manejarBotonSiguiente() {
    console.log('---Botón siguiente clickeado---')

    if (++preguntaActualIndex < preguntas.length) { // Incrementar el índice de la pregunta actual y verificar si hay más preguntas
        mostrarPregunta(); // si hay mas preguntas, mostrar la siguiente pregunta
    } else {
        mostrarResultados(); // Si no hay más preguntas, mostrar los resultados
    }
}

function mostrarResultados() {
    console.log('---Mostrando resultados---')

    tiempoFin = Date.now(); // Guardar el tiempo de fin
    const tiempoTotal = (tiempoFin - tiempoInicio) / 1000; // Calcular el tiempo total en segundos

    // Calcular el tiempo promedio por pregunta
    const tiempoPromedio = tiemposRespuestas.reduce((a, b) => a + b, 0) / tiemposRespuestas.length || 0; // Calcular el tiempo promedio de respuesta

    reiniciar(); // Limpiar respuestas anteriores y ocultar el botón "Siguiente"
    
    avisoElement.innerHTML = `¡Fin del Juego! | Correctas: ${cant_correctas} | Incorrectas: ${cant_incorrectas} | Duración de partida: ${tiempoTotal.toFixed(2)} segundos | Tiempo promedio por pregunta: ${tiempoPromedio.toFixed(2)} segundos` // Mostrar el resultado en el DOM
    siguienteButton.innerHTML = "Volver a Jugar"; // Cambiar el texto del botón 
    siguienteButton.style.display = "block"; // Mostrar el botón "Volver a Jugar"

    console.log(`---Fin del juego---`)
    console.log(`        Correctas: ${cant_correctas} 
        Incorrectas: ${cant_incorrectas} 
        Duración de partida: ${tiempoTotal.toFixed(2)} segundos 
        Tiempo Promedio por pregunta: ${tiempoPromedio.toFixed(2)} sec.`); // Mostrar en consola el resultado
}

// Agregar un evento de clic al botón "Siguiente"
siguienteButton.addEventListener("click", () => {
    preguntaActualIndex < preguntas.length ? manejarBotonSiguiente() : comenzarCuestionario(); // Si hay más preguntas, manejar el botón "Siguiente", si no, reiniciar el cuestionario
})








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