const Expresion = require('../abstract/expresion');

class OperacionUnaria extends Expresion {
    constructor(operador, operando, linea, columna) {
        super(linea, columna);
        this.operador = operador;
        this.operando = operando;
    }

    ejecutar(entorno) {
        const valor = this.operando.ejecutar(entorno);

        switch (this.operador) {
            case 'MENOS':
                if (typeof valor !== 'number') {
                    throw new Error(`Operador unario '-' no válido para tipo ${typeof valor} en ${this.getPosicion()}`);
                }
                return -valor;
            case 'NOT':
                return !valor;
            default:
                throw new Error(`Operador unario '${this.operador}' no reconocido en ${this.getPosicion()}`);
        }
    }


    toString() {
        return `OperacionUnaria(${this.operador} ${this.operando.toString()})`;
    }
}

module.exports = OperacionUnaria;