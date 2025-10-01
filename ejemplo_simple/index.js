const fs = require('fs');

const gramatica = require('./gramatica.js');

fs.readFile('./entrada.txt', 'utf-8', (err, data) => {

    if (err) throw err;

    // si no hay errores
    gramatica.parse(data.toString())
})