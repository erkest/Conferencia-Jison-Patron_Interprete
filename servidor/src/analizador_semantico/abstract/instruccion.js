
class Instruccion {
    constructor(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(entorno) {
        throw new Error("Método ejecutar() debe ser implementado por la clase concreta");
    }

    getPosicion() {
        return `Línea: ${this.linea}, Columna: ${this.columna}`;
    }
}

module.exports = Instruccion;
