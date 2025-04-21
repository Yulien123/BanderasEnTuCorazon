const express = require('express')
const app = express()
const PORT = process.env.PORT ?? 3000

// Endpoint Raíz
app.get('/', (req, res) => {
    res.send('<h1>Hola Mundo</h1>')
})

// Levanta el servidor en el puerto enviado por PORT
// Iniciar con 'npm start'
app.listen(PORT, () => {
    console.log(`Server Listening on port http://localhost:${PORT}`)    
})

