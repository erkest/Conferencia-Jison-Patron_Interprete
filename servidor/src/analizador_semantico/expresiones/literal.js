const Expresion = require('../abstract/expresion');

class Literal extends Expresion {
    constructor(valor, linea, columna) {
        super(linea, columna);
        this.valor = valor;
    }

    ejecutar(entorno) {
        return this.valor;
    }


    toString() {
        return `Literal(${this.valor})`;
    }
}

module.exports = Literal;
