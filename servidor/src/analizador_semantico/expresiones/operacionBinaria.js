const Expresion = require('../abstract/expresion');

class OperacionBinaria extends Expresion {
    constructor(izquierda, operador, derecha, linea, columna) {
        super(linea, columna);
        this.izquierda = izquierda;
        this.operador = operador;
        this.derecha = derecha;
    }

    ejecutar(entorno) {
        const valorIzq = this.izquierda.ejecutar(entorno);
        const valorDer = this.derecha.ejecutar(entorno);

        switch (this.operador) {
            // Operadores aritméticos
            case 'MAS':
                return valorIzq + valorDer;
            case 'MENOS':
                return valorIzq - valorDer;
            case 'MULTIPLICACION':
                return valorIzq * valorDer;
            case 'DIVISION':
                if (valorDer === 0) {
                    throw new Error(`División por cero en ${this.getPosicion()}`);
                }
                return valorIzq / valorDer;
            case 'MODULO':
                if (valorDer === 0) {
                    throw new Error(`Módulo por cero en ${this.getPosicion()}`);
                }
                return valorIzq % valorDer;

            // Operadores relacionales
            case 'IGUAL':
                return valorIzq == valorDer;
            case 'DIFERENTE':
                return valorIzq != valorDer;
            case 'MENOR':
                return valorIzq < valorDer;
            case 'MAYOR':
                return valorIzq > valorDer;
            case 'MENOR_IGUAL':
                return valorIzq <= valorDer;
            case 'MAYOR_IGUAL':
                return valorIzq >= valorDer;

            // Operadores lógicos
            case 'AND':
                return valorIzq && valorDer;
            case 'OR':
                return valorIzq || valorDer;

            default:
                throw new Error(`Operador binario '${this.operador}' no reconocido en ${this.getPosicion()}`);
        }
    }

    toString() {
        return `OperacionBinaria(${this.izquierda.toString()} ${this.operador} ${this.derecha.toString()})`;
    }
}

module.exports = OperacionBinaria;