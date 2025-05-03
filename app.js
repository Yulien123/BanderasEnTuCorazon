const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar JSON y archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// Guarda una partida en el archivo JSON
app.post('/guardar-partida', (req, res) => {
    const { jugador, puntaje, respuestasCorrectas, tiempoTotal } = req.body;

    // Leer el archivo JSON
    let partidas = JSON.parse(fs.readFileSync('partidas.json', 'utf8'));

    // Agregar la nueva partida
    partidas.push({ jugador, puntaje, respuestasCorrectas, tiempoTotal });

    // Ordenar por puntaje y mantener solo las 20 mejores
    partidas.sort((a, b) => b.puntaje - a.puntaje || b.respuestasCorrectas - a.respuestasCorrectas || a.tiempoTotal - b.tiempoTotal);
    partidas = partidas.slice(0, 20);

    // Guardar en el archivo JSON
    fs.writeFileSync('partidas.json', JSON.stringify(partidas, null, 2));

    res.json({ mensaje: 'Partida guardada correctamente' });
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Función para traducir un texto usando node-google-translate-skidz -> modularizar esta parte!
async function traducirAsync(texto, sourceLang = "en", targetLang = "es") {
    const resultado = await translate({
        text: texto,
        source: sourceLang,
        target: targetLang
    })
    return resultado.translation
}

// Ruta para manejar la traducción
app.post('/traducir', async (req, res) => {
    const { texto } = req.body
    try {
        const traduccion = await traducirAsync(texto)
        res.json({ traduccion })
    } catch (error) {
        console.error("Error al traducir:", error)
        res.status(500).json({ error: 'Error al traducir' })
    }
})

// Ruta para Errores
app.use((req, res) => {
    //res.status(404).send('<h1> Error 404 </h1>')
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'))
})

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
