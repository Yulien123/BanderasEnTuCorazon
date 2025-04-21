const express = require('express')
const path = require('path')

const app = express()
//Variable de entorno para el puerto, Si no existe la variable de entorno PORT, se asigna el valor 3000
const PORT = process.env.PORT ?? 3000

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint Raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Levanta el servidor en el puerto enviado por PORT
// Iniciar con 'npm start'
app.listen(PORT, () => {
    console.log(`Server Listening on port http://localhost:${PORT}`)    
})

