const Instruccion = require('../abstract/instruccion');

class Asignacion extends Instruccion {
    constructor(identificador, expresion, linea, columna) {
        super(linea, columna);
        this.identificador = identificador;
        this.expresion = expresion;
    }

    ejecutar(entorno) {
        try {
            const id = this.identificador.ejecutar(entorno);
            const valor = this.expresion.ejecutar(entorno);
            
            // Si la variable existe, la asigna; si no, la define
            if (entorno.existe(id)) {
                entorno.asignar(id, valor);
            } else {
                console.log("asignando a variable existente:", id);
                entorno.definir(id, valor);
            }
            
            return valor;
        } catch (error) {
            throw new Error(`Error en asignación: ${error.message} en ${this.getPosicion()}`);
        }
    }

    toString() {
        return `Asignacion(${this.identificador} = ${this.expresion.toString()})`;
    }
}

module.exports = Asignacion;
