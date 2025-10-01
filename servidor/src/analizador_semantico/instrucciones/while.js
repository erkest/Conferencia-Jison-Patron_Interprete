const Instruccion = require('../abstract/instruccion');

class While extends Instruccion {
    constructor(condicion, sentencia, linea, columna) {
        super(linea, columna);
        this.condicion = condicion;
        this.sentencia = sentencia;
    }

    ejecutar(entorno) {
        try {
            let resultado = null;
            let iteraciones = 0;
            const MAX_ITERACIONES = 10000; // Protección contra bucles infinitos

            while (this.esVerdadero(this.condicion.ejecutar(entorno))) {
                // Protección contra bucles infinitos
                if (iteraciones >= MAX_ITERACIONES) {
                    throw new Error(`Posible bucle infinito detectado (${MAX_ITERACIONES} iteraciones) en ${this.getPosicion()}`);
                }
                
                resultado = this.sentencia.ejecutar(entorno);
                iteraciones++;
            }
            
            return;
        } catch (error) {
            throw new Error(`Error en while: ${error.message} en ${this.getPosicion()}`);
        }
    }

    esVerdadero(valor) {
        if (typeof valor === 'boolean') return valor;
        if (typeof valor === 'number') return valor !== 0;
        if (typeof valor === 'string') return valor !== '';
        if (valor === null || valor === undefined) return false;
        return true;
    }

    toString() {
        return `While(${this.condicion.toString()}, ${this.sentencia.toString()})`;
    }
}

module.exports = While;