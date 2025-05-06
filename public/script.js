// URL de la API de países
const URL_ALL = "https://restcountries.com/v3.1/all?fields=name,capital,borders,flags,continents,translations";

// Preguntas del cuestionario con valores de puntos
// Cada pregunta está asociada a un tipo y una cantidad de puntaje
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
const botonRanking = document.getElementById("botonRanking")
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
// configura la pantalla inicial y escucha el evento de inicio del cuestionario
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

// Función para inicia el cuestionario, resetea variables y muestra la primer pregunta
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
    botonRanking.style.display = "none";
    numeroPreguntaElement.innerHTML = `Pregunta 1 / 10`;

    mostrarPregunta();
}

// Función async para obtiene los datos de la API
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

// Función para devolver un país aleatorio 
function obtenerPaisAleatorio(paises) {
    console.log("Obteniendo un país aleatorio");
    return paises[Math.floor(Math.random() * paises.length)];
}

// Función para generar respuestas aleatorias para una pregunta determinada
function generarRespuestas(paises, correcta, tipo) {
    console.log("Generando respuestas aleatorias");
    let respuestas = [];

    if (tipo === "limitrofes") {
        // Obtiene la cantidad de países limítrofes del país correcto
        let cantidadLimitrofes = paises.find(pais => pais.name.common === correcta)?.borders?.length || 0;
        respuestas.push({ respuesta: cantidadLimitrofes === 0 ? "No tiene" : cantidadLimitrofes, correcta: true });

        //Genera opciones incorrectas basadas en diferentes cantidades de países limítrofes
        const opciones = [...new Set(paises.map(pais => pais.borders?.length || 0))]
            .filter(num => num !== cantidadLimitrofes) // excluye la respuesta correcta
            .map(num => num === 0 ? "No tiene" : num) // Formatea respuestas
            .sort(() => Math.random() - 0.5) // Mezcla aleatoriamente
            .slice(0, 3); // Selecciona 3 opciones incorrectas

        respuestas = respuestas.concat(opciones.map(respuesta => ({ respuesta, correcta: false })));
    } else {
        // Agrega la respuesta correcta
        respuestas.push({ respuesta: correcta, correcta: true });

        // Genera opciones incorrectas basadas en nombres de países diferentes
        const opciones = paises.filter(pais => pais.name.common !== correcta)
            .sort(() => Math.random() - 0.5) // Mezcla aleatoriamente
            .slice(0, 3) // Selecciona tres opciones incorrectas
            .map(pais => ({ respuesta: pais.name.common, correcta: false }));

        respuestas = respuestas.concat(opciones);
    }
    
    // Mezcla todas las respuestas antes de devolverlas
    respuestas.sort(() => Math.random() - 0.5);
    return respuestas;
}

// función async que muestra la pregunta y las opciones de respuesta
// dependiendo del tipo de pregunta (ciudad, bandera o limitrofes)
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
    siguienteButton.style.display = "none";

}

// Función para manejar la selección de respuesta, actualiza el puntaje y muestra la siguiente pregunta
// deshabilita los botones de respuesta y muestra el aviso correspondiente
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

// Función para guarda la partida en el servidor
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

// Función que muestra los resultados finales, calcula el tiempo total y promedio, y muestra el ranking
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
                                <button onclick="verRanking()">Ver Ranking</button>`;

    pantallaInicio.style.display = "block";
    guardarPartida();
}

// Funcion para redirigir a la página de ranking
function verRanking() {
    console.log("Redirigiendo a la página de ranking");
    window.location.href = "ranking.html";
}

// Maneja el botón "Siguiente", que muestra la siguiente pregunta o los resultados finales
siguienteButton.addEventListener("click", () => {
    console.log("Botón siguiente presionado");
    if (preguntaActualIndex < 10) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
});

