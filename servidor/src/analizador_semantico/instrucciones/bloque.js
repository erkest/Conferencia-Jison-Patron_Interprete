const Instruccion = require('../abstract/instruccion');

class Bloque extends Instruccion {
    constructor(sentencias, linea, columna) {
        super(linea, columna);
        this.sentencias = sentencias;
    }

    ejecutar(entorno) {
        try {
            // Crear un nuevo entorno para el bloque (scope local)
            const entornoBloque = entorno.crearEntornoHijo();
            
            let resultado = null;
            
            for (const sentencia of this.sentencias) {
                resultado = sentencia.ejecutar(entornoBloque);
            }
            
            return resultado;
        } catch (error) {
            throw new Error(`Error en bloque: ${error.message} en ${this.getPosicion()}`);
        }
    }


    toString() {
        const sentenciasStr = this.sentencias.map(s => s.toString()).join(', ');
        return `Bloque([${sentenciasStr}])`;
    }
}

module.exports = Bloque;