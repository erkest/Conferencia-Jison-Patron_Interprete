class Entorno {
    constructor(entornoAnterior = null) {
        this.variables = new Map();
        this.entornoAnterior = entornoAnterior;
        this.salida = [];
    }

    definir(nombre, valor) {
        this.variables.set(nombre, valor);
    }

    // Asigna un valor a una variable existente
    asignar(nombre, valor) {
        if (this.variables.has(nombre)) {
            this.variables.set(nombre, valor);
            return;
        }

        if (this.entornoAnterior !== null) {
            this.entornoAnterior.asignar(nombre, valor);
            return;
        }

        throw new Error(`Variable '${nombre}' no declarada`);
    }

    // Obtiene el valor de una variable
    obtener(nombre) {
        if (this.variables.has(nombre)) {
            return this.variables.get(nombre);
        }

        if (this.entornoAnterior !== null) {
            return this.entornoAnterior.obtener(nombre);
        }

        throw new Error(`Variable '${nombre}' no declarada`);
    }

    // Verifica si una variable existe en el entorno actual o en alguno anterior
    existe(nombre) {
        if (this.variables.has(nombre)) {
            return true;
        }

        if (this.entornoAnterior !== null) {
            return this.entornoAnterior.existe(nombre);
        }

        return false;
    }

    getVariables() {
        return new Map(this.variables);
    }

    crearEntornoHijo() {
        const entornoHijo = new Entorno(this);
        return entornoHijo;
    }

    // Esto busca el entorno global y agrega la salida ahí
    agregarSalida(texto) {
        if (this.entornoAnterior !== null) {
            this.entornoAnterior.agregarSalida(texto);
        }
        this.salida.push(texto);
    }
}

module.exports = Entorno;