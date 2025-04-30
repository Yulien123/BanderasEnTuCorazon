/**
 * URL de la API de países con los campos necesarios
 */
const URL_ALL = "https://restcountries.com/v3.1/all?fields=name,capital,borders,flags,continents,translations";

/**
 * Preguntas del cuestionario (rotando tipos)
 */
const preguntas = [
    { pregunta: "¿A qué país pertenece la ciudad ", tipo: "ciudad" },
    { pregunta: "¿A qué país le pertenece esta bandera ", tipo: "bandera" },
    { pregunta: "¿Cuántos países limítrofes tiene el país ", tipo: "limitrofes" }
];

// Elementos del DOM
const preguntaElement = document.getElementById("pregunta");
const respuestaButtons = document.getElementById("respuestas-buttons");
const siguienteButton = document.getElementById("siguiente-btn");
const avisoElement = document.getElementById("aviso");
const numeroPreguntaElement = document.getElementById("numero-pregunta"); // Nuevo elemento para el número de pregunta

// Variables del cuestionario
let preguntaActualIndex = 0;
let cantCorrectas = 0;
let cantIncorrectas = 0;
let tiempoInicio, tiempoFin;
let tiemposRespuestas = [];

/**
 * Inicia el cuestionario
 */
function comenzarCuestionario() {
    console.log('\n---Inicia el juego---');

    tiempoInicio = Date.now();
    preguntaActualIndex = 0;
    cantCorrectas = 0;
    cantIncorrectas = 0;
    tiemposRespuestas = [];

    avisoElement.innerHTML = "";
    siguienteButton.textContent = "Siguiente";
    siguienteButton.style.display = "none";
    numeroPreguntaElement.innerHTML = `Pregunta 1 / 10`; // Inicializar número de pregunta

    mostrarPregunta();
}

/**
 * Obtiene los datos de la API
 */
async function obtenerDatos() {
    try {
        const respuesta = await fetch(URL_ALL);
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener datos", error);
        return [];
    }
}

/**
 * Devuelve un país aleatorio de la lista
 */
function obtenerPaisAleatorio(paises) {
    return paises[Math.floor(Math.random() * paises.length)];
}

/**
 * Genera respuestas aleatorias, asegurando que la correcta no esté siempre en la misma posición
 */
function generarRespuestas(paises, correcta, tipo) {
    let respuestas = [];

    if (tipo === "limitrofes") {
        let cantidadLimitrofes = paises.find(pais => pais.name.common === correcta)?.borders?.length || 0;
        respuestas.push({ respuesta: cantidadLimitrofes === 0 ? "No tiene" : cantidadLimitrofes, correcta: true });

        const opciones = [...new Set(paises.map(pais => pais.borders?.length || 0))]
            .filter(num => num !== cantidadLimitrofes)
            .map(num => num === 0 ? "No tiene" : num) // Reemplazar 0 por "No tiene"
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        respuestas = respuestas.concat(opciones.map(respuesta => ({ respuesta, correcta: false })));
    } else {
        respuestas.push({ respuesta: correcta, correcta: true });

        const opciones = paises
            .filter(pais => pais.name.common !== correcta)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(pais => ({ respuesta: pais.name.common, correcta: false }));

        respuestas = respuestas.concat(opciones);
    }

    respuestas.sort(() => Math.random() - 0.5);
    return respuestas;
}

/**
 * Muestra la pregunta y las opciones de respuesta
 */
async function mostrarPregunta() {
    const paises = await obtenerDatos();
    const paisAleatorio = obtenerPaisAleatorio(paises);

    // Alternar tipo de pregunta en cada iteración
    const preguntaActual = preguntas[preguntaActualIndex % preguntas.length];

    avisoElement.innerHTML = "";
    numeroPreguntaElement.innerHTML = `Pregunta ${preguntaActualIndex + 1} / 10`; // Mostrar número de pregunta

    let comodin = preguntaActual.tipo === "ciudad" ? paisAleatorio.capital?.[0] || "Desconocida"
                : preguntaActual.tipo === "bandera" ? `<img src="${paisAleatorio.flags.svg}" alt="Bandera">`
                : paisAleatorio.name.common;

    preguntaElement.innerHTML = `${preguntaActual.pregunta} ${comodin}?`;

    let respuestas = generarRespuestas(paises, paisAleatorio.name.common, preguntaActual.tipo);
    respuestaButtons.innerHTML = "";

    respuestas.forEach(({ respuesta, correcta }) => {
        const boton = document.createElement("button");
        boton.textContent = respuesta;
        boton.classList.add("btn");
        boton.dataset.correcta = correcta;
        boton.addEventListener("click", seleccionarRespuesta);
        respuestaButtons.appendChild(boton);
    });
}

/**
 * Maneja la selección de respuesta
 */
function seleccionarRespuesta(e) {
    console.log('¡Respuesta seleccionada!');
    const botonSeleccionado = e.target;

    const tiempoRespuesta = (Date.now() - tiempoInicio) / 1000;
    tiemposRespuestas.push(tiempoRespuesta);

    if (botonSeleccionado.dataset.correcta === 'true') {
        botonSeleccionado.classList.add("correcta");
        avisoElement.innerHTML = "¡Correcto! 🎉";
        cantCorrectas++;
    } else {
        botonSeleccionado.classList.add("incorrecta");
        const respuestaCorrecta = [...respuestaButtons.children].find(boton => boton.dataset.correcta === "true");
        avisoElement.innerHTML = `Incorrecto ❌. La respuesta correcta era: ${respuestaCorrecta.textContent}`;
        cantIncorrectas++;
        respuestaCorrecta.classList.add("correcta");
    }

    [...respuestaButtons.children].forEach(boton => boton.disabled = true);
    siguienteButton.style.display = "block";
}

/**
 * Reinicia el cuestionario y oculta el botón siguiente
 */
function reiniciar() {
    siguienteButton.style.display = "none";
    respuestaButtons.innerHTML = "";
    avisoElement.innerHTML = "";
    preguntaElement.innerHTML = "";
}

/**
 * Maneja el botón "Siguiente"
 */
function manejarBotonSiguiente() {
    preguntaActualIndex++;

    if (preguntaActualIndex < 10) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
}

/**
 * Muestra los resultados del juego
 */
function mostrarResultados() {
    numeroPreguntaElement.innerHTML = "Fin del juego";
    tiempoFin = Date.now();
    const tiempoTotal = (tiempoFin - tiempoInicio) / 1000;
    const tiempoPromedio = tiemposRespuestas.reduce((a, b) => a + b, 0) / tiemposRespuestas.length || 0;

    reiniciar();

    avisoElement.innerHTML = `Resultados... Correctas: ${cantCorrectas} | Incorrectas: ${cantIncorrectas} | Duración: ${tiempoTotal.toFixed(2)} s | Tiempo promedio por pregunta: ${tiempoPromedio.toFixed(2)} s`;

    siguienteButton.textContent = "Volver a Jugar";
    siguienteButton.style.display = "block";
}

// Evento para el botón "Siguiente"
siguienteButton.addEventListener("click", () => {
    manejarBotonSiguiente();
});

// Iniciar el juego
document.addEventListener("DOMContentLoaded", () => {
    comenzarCuestionario();
});



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


