const express = require('express')
const path = require('path')
const translate = require('node-google-translate-skidz')

const app = express()
//Variable de entorno para el puerto, Si no existe la variable de entorno PORT, se asigna el valor 3000
const PORT = process.env.PORT ?? 3000

// Middleware
app.use(express.json()) // Para recibir datos en formato JSON
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint Raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

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
// Levanta el servidor en el puerto enviado por PORT
// Iniciar con 'npm start'
app.listen(PORT, () => {
    console.log(`Server Listening on port http://localhost:${PORT}`)
})

