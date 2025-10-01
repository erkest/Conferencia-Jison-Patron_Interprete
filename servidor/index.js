// Archivo de configuración del servidor usando Express

const express = require('express');
const cors = require('cors');
const analisis = require('./src/routes/analisis');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());

// Ruta básica
app.get('/', (req, res) => {
    res.json({
        message: 'Servidor funcionando correctamente!',
    });
});

// Usar las rutas de la API
// aquí es donde se montan las rutas definidas en routes/analisis.js
app.use('/', analisis);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;