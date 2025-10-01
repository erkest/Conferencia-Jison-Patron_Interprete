class Nodo {
    constructor(tipo, valor = null, hijos = [], linea = 0, columna = 0) {
        this.tipo = tipo;
        this.valor = valor;
        this.hijos = hijos;
        this.linea = linea;
        this.columna = columna;
    }

    // Contador estático para generar IDs únicos
    static contador = 0;

    agregarHijo(hijo) {
        this.hijos.push(hijo);
    }

    getHijo(indice) {
        return this.hijos[indice];
    }

    getNumeroHijos() {
        return this.hijos.length;
    }

    getPosicion() {
        return `línea ${this.linea}, columna ${this.columna}`;
    }

    toString() {
        if (this.valor !== null) {
            return `Nodo(${this.tipo}: ${this.valor})`;
        }
        return `Nodo(${this.tipo})`;
    }

    toStringArbol(nivel = 0) {
        let resultado = '  '.repeat(nivel) + this.toString() + '\n';
        for (const hijo of this.hijos) {
            resultado += hijo.toStringArbol(nivel + 1);
        }
        return resultado;
    }


    graficar() {
        let result = "";
        const nombre = "n" + Nodo.contador;
        let nombreHijo = "";
        
        // Crear etiqueta del nodo
        let etiqueta = this.tipo;
        if (this.valor !== null) {
            etiqueta += `\\n${this.valor}`;
        }
        
        result += `${nombre}[label="${etiqueta}"];\n`;
        
        // Procesar hijos
        for (const hijo of this.hijos) {
            Nodo.contador++;
            nombreHijo = "n" + Nodo.contador;
            
            result += hijo.graficar();
            result += `${nombre}->${nombreHijo};\n`;
        }
        
        return result;
    }


    static reiniciarContador() {
        Nodo.contador = 0;
    }
}

module.exports = Nodo;