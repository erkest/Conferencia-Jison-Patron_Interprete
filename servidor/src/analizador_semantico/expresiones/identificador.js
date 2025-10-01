const Expresion = require('../abstract/expresion');

class Identificador extends Expresion {
    constructor(nombre, acceso, linea, columna) {
        super(linea, columna);
        this.nombre = nombre;
        this.acceso = acceso;
    }

    ejecutar(entorno) {
        if (this.acceso) {
            return entorno.obtener(this.nombre)
        }
        return this.nombre;
    }

    toString() {
        return `Identificador(${this.nombre})`;
    }
}

module.exports = Identificador;