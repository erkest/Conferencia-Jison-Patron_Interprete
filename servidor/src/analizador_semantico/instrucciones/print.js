const Instruccion = require('../abstract/instruccion');

class Print extends Instruccion {
    constructor(expresiones, linea, columna) {
        super(linea, columna);
        this.expresiones = expresiones;
    }

    ejecutar(entorno) {
        try {
            const valores = this.expresiones.map(expr => {
                const valor = expr.ejecutar(entorno);
                // Convertir a string apropiadamente
                if (typeof valor === 'string') {
                    return valor;
                } else if (typeof valor === 'number') {
                    return valor.toString();
                } else if (typeof valor === 'boolean') {
                    return valor ? 'true' : 'false';
                } else if (valor === null) {
                    return 'null';
                } else if (valor === undefined) {
                    return 'undefined';
                } else {
                    return String(valor);
                }
            });

            const salida = valores.join(' ');
            
            console.log(salida); 
            entorno.agregarSalida(salida);
            return;
        } catch (error) {
            throw new Error(`Error en print: ${error.message} en ${this.getPosicion()}`);
        }
    }

    toString() {
        const expresionesStr = this.expresiones.map(expr => expr.toString()).join(', ');
        return `Print(${expresionesStr})`;
    }
}

module.exports = Print;