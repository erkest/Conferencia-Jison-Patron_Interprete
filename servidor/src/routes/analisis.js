const express = require('express');
const AnalizadorCompleto = require('../analizador/analizadorCompleto');
const router = express.Router();

let analizador = new AnalizadorCompleto();

router.post('/analizar', (req, res) => {
    try {
        const { codigo } = req.body;
        
        if (!codigo) {
            return res.json({
                exito: false,
                salida: ['Error: No se proporcionó código para analizar']
            });
        }

        // Ejecutar el código completo usando el analizador
        const resultado = analizador.analizarYEjecutar(codigo);
        
        if (resultado.exito) {
            // Enviar la estructura que espera el frontend
            res.json({
                exito: true,
                salida: resultado.salida || []
            });
        } else {
            // En caso de error, retornar el mensaje de error
            res.json({
                exito: false,
                salida: [resultado.error || 'Error desconocido']
            });
        }

    } catch (error) {
        res.json({
            exito: false,
            salida: [error.message]
        });
    }
});

module.exports = router;