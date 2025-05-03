// URL de la API de países
const URL_ALL = "https://restcountries.com/v3.1/all?fields=name,capital,borders,flags,continents,translations";

// Preguntas del cuestionario con valores de puntos
const preguntas = [
    { pregunta: "¿A qué país le pertenece la ciudad de ", tipo: "ciudad", puntos: 3 },
    { pregunta: "¿Qué país está representado por la siguiente bandera", tipo: "bandera", puntos: 5 },
    { pregunta: "¿Cuántos países limítrofes tiene el país", tipo: "limitrofes", puntos: 3 }
];

// Elementos del DOM
const pantallaInicio = document.getElementById("pantalla-inicio");
const nombreInput = document.getElementById("nombre-input");
const comenzarButton = document.getElementById("comenzar-btn");
const pantallaJuego = document.getElementById("pantalla-juego");
const preguntaElement = document.getElementById("pregunta");
const respuestaButtons = document.getElementById("respuestas-buttons");
const siguienteButton = document.getElementById("siguiente-btn");
const avisoElement = document.getElementById("aviso");
const numeroPreguntaElement = document.getElementById("numero-pregunta");

// Variables del juego
let nombreJugador = "";
let preguntaActualIndex = 0;
let cantCorrectas = 0;
let cantIncorrectas = 0;
let puntajeTotal = 0;
let tiempoInicio, tiempoFin;
let tiemposRespuestas = [];

// Pantalla inicial para ingresar nombre
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando pantalla inicial");
    pantallaJuego.style.display = "none";

    comenzarButton.addEventListener("click", () => {
        console.log("Botón comenzar presionado");
        nombreJugador = nombreInput.value.trim();
        if (nombreJugador === "") {
            alert("Por favor, ingresa tu nombre.");
            return;
        }

        pantallaInicio.style.display = "none";
        pantallaJuego.style.display = "block";
        comenzarCuestionario();
    });
});

// Inicia el cuestionario
function comenzarCuestionario() {
    console.log("Iniciando cuestionario");
    tiempoInicio = Date.now();
    preguntaActualIndex = 0;
    cantCorrectas = 0;
    cantIncorrectas = 0;
    puntajeTotal = 0;
    tiemposRespuestas = [];


    avisoElement.innerHTML = "";
    siguienteButton.style.display = "none";
    numeroPreguntaElement.innerHTML = `Pregunta 1 / 10`;

    mostrarPregunta();
}

// Obtiene los datos de la API
async function obtenerDatos() {
    console.log("Obteniendo datos de la API");
    try {
        const respuesta = await fetch(URL_ALL);
        const paises = await respuesta.json();
        return paises;
    } catch (error) {
        console.error("Error al obtener datos", error);
        return [];
    }
}

// Devuelve un país aleatorio
function obtenerPaisAleatorio(paises) {
    console.log("Obteniendo un país aleatorio");
    return paises[Math.floor(Math.random() * paises.length)];
}

// Genera respuestas aleatorias
function generarRespuestas(paises, correcta, tipo) {
    console.log("Generando respuestas aleatorias");
    let respuestas = [];
    if (tipo === "limitrofes") {
        let cantidadLimitrofes = paises.find(pais => pais.name.common === correcta)?.borders?.length || 0;
        respuestas.push({ respuesta: cantidadLimitrofes === 0 ? "No tiene" : cantidadLimitrofes, correcta: true });

        const opciones = [...new Set(paises.map(pais => pais.borders?.length || 0))]
            .filter(num => num !== cantidadLimitrofes)
            .map(num => num === 0 ? "No tiene" : num)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        respuestas = respuestas.concat(opciones.map(respuesta => ({ respuesta, correcta: false })));
    } else {
        respuestas.push({ respuesta: correcta, correcta: true });

        const opciones = paises.filter(pais => pais.name.common !== correcta)
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
    console.log("Mostrando pregunta");
    const paises = await obtenerDatos();
    const paisAleatorio = obtenerPaisAleatorio(paises);

    const preguntaActual = preguntas[preguntaActualIndex % preguntas.length];

    avisoElement.innerHTML = "";
    numeroPreguntaElement.innerHTML = `Pregunta ${preguntaActualIndex + 1} / 10`;

    let comodin = preguntaActual.tipo === "ciudad" ? paisAleatorio.capital?.[0] || "Desconocida"
                : preguntaActual.tipo === "bandera" ? `<img src="${paisAleatorio.flags.svg}" alt="Bandera">`
                : paisAleatorio.name.common;

    if(preguntaActual.tipo === "bandera"){ 
        preguntaElement.innerHTML = `${preguntaActual.pregunta} ${comodin}`;
    } else {
        preguntaElement.innerHTML = `${preguntaActual.pregunta} ${comodin}?`;
    }

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
    preguntaActualIndex++
}

/**
 * Maneja la selección de respuesta
 */
function seleccionarRespuesta(e) {
    console.log("Seleccionando respuesta");
    const botonSeleccionado = e.target;
    const preguntaActual = preguntas[preguntaActualIndex % preguntas.length];
    const tiempoRespuesta = (Date.now() - tiempoInicio) / 1000;
    tiemposRespuestas.push(tiempoRespuesta);

    if (botonSeleccionado.dataset.correcta === 'true') {
        botonSeleccionado.classList.add("correcta");
        avisoElement.innerHTML = `¡Correcto! 🎉 (+${preguntaActual.puntos} pts)`;
        cantCorrectas++;
        puntajeTotal += preguntaActual.puntos;
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
 * Guarda la partida en el servidor
 */
function guardarPartida() {
    console.log("Guardando partida");
    fetch('/guardar-partida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jugador: nombreJugador,
            puntaje: puntajeTotal,
            respuestasCorrectas: cantCorrectas,
            tiempoTotal: (tiempoFin - tiempoInicio) / 1000
        })
    })
    .then(response => response.json())
    .then(data => console.log("Partida guardada:", data))
    .catch(error => console.error("Error al guardar partida:", error));
}


/**
 * Muestra los resultados finales
 */
function mostrarResultados() {
    console.log("Mostrando resultados finales");
    tiempoFin = Date.now();
    const tiempoTotal = (tiempoFin - tiempoInicio) / 1000;
    const tiempoPromedio = tiemposRespuestas.reduce((a, b) => a + b, 0) / tiemposRespuestas.length || 0;

    pantallaJuego.style.display = "none";
    pantallaInicio.innerHTML = `<h2>¡Fin del Juego!</h2>
                                <p>Jugador: <strong>${nombreJugador}</strong></p>
                                <p>Puntaje final: <strong>${puntajeTotal} pts</strong></p>
                                <p>Correctas: ${cantCorrectas} | Incorrectas: ${cantIncorrectas}</p>
                                <p>Duración total: ${tiempoTotal.toFixed(2)} s</p>
                                <p>Tiempo promedio por pregunta: ${tiempoPromedio.toFixed(2)} s</p>
                                <button><a href="index.html">Volver a jugar</a></button>
                                <button>Ver Ranking</button>`;

    pantallaInicio.style.display = "block";
    guardarPartida();
}

// Maneja el botón "Siguiente"
siguienteButton.addEventListener("click", () => {
    console.log("Botón siguiente presionado");
    if (preguntaActualIndex < 10) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
});

