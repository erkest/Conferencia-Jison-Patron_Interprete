const Instruccion = require('../abstract/instruccion');

class If extends Instruccion {
    constructor(condicion, sentenciaVerdadera, sentenciaFalsa = null, linea, columna) {
        super(linea, columna);
        this.condicion = condicion;
        this.sentenciaVerdadera = sentenciaVerdadera;
        this.sentenciaFalsa = sentenciaFalsa;
    }

    ejecutar(entorno) {
        try {
            const valorCondicion = this.condicion.ejecutar(entorno);
            
            // Evaluación de condición booleana
            const condicionVerdadera = this.esVerdadero(valorCondicion);

            if (condicionVerdadera) {
                return this.sentenciaVerdadera.ejecutar(entorno);
            } else if (this.sentenciaFalsa !== null) {
                return this.sentenciaFalsa.ejecutar(entorno);
            }
            
            return null;
        } catch (error) {
            throw new Error(`Error en if: ${error.message} en ${this.getPosicion()}`);
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
        let str = `If(${this.condicion.toString()}, ${this.sentenciaVerdadera.toString()}`;
        if (this.sentenciaFalsa) {
            str += `, ${this.sentenciaFalsa.toString()}`;
        }
        str += ')';
        return str;
    }
}

module.exports = If;