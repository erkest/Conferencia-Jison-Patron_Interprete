const Nodo = require('./abstract/nodo');

// Importar todas las clases de expresiones e instrucciones
const Literal = require('./expresiones/literal');
const Identificador = require('./expresiones/identificador');
const OperacionBinaria = require('./expresiones/operacionBinaria');
const OperacionUnaria = require('./expresiones/operacionUnaria');

const Asignacion = require('./instrucciones/asignacion');
const Bloque = require('./instrucciones/bloque');
const If = require('./instrucciones/if');
const Print = require('./instrucciones/print');
const While = require('./instrucciones/while');

/**
 * Generador de instancias que convierte un AST de nodos genéricos
 * en instancias específicas de expresiones e instrucciones
 */
class GeneradorInstancias {
    constructor() {
        this.errores = [];
    }

    // Genera las instancias específicas a partir del AST de nodos
    generar(nodo) {
        this.errores = [];
        try {
            return this.procesarNodo(nodo);
        } catch (error) {
            this.errores.push(error.message);
            throw error;
        }
    }

    procesarNodo(nodo) {
        if (!nodo || !(nodo instanceof Nodo)) {
            throw new Error(`Nodo inválido: ${nodo}`);
        }

        switch (nodo.tipo) {
            // PROGRAMA
            case 'PROGRAMA':
                return this.generarPrograma(nodo);

            // EXPRESIONES
            case 'NUMERO':
                return new Literal(nodo.valor, 'NUMERO', nodo.linea, nodo.columna);
            
            case 'CADENA':
                return new Literal(nodo.valor, 'CADENA', nodo.linea, nodo.columna);
            
            case 'IDENTIFICADOR':
                return new Identificador(nodo.valor, true, nodo.linea, nodo.columna);

            // OPERACIONES BINARIAS
            case 'MAS':
            case 'MENOS':
            case 'MULTIPLICACION':
            case 'DIVISION':
            case 'MODULO':
            case 'IGUAL':
            case 'DIFERENTE':
            case 'MENOR':
            case 'MAYOR':
            case 'MENOR_IGUAL':
            case 'MAYOR_IGUAL':
            case 'AND':
            case 'OR':
                return this.generarOperacionBinaria(nodo);

            // OPERACIONES UNARIAS
            case 'MENOS_UNARIO':
            case 'NOT':
                return this.generarOperacionUnaria(nodo);

            // INSTRUCCIONES
            case 'ASIGNACION':
                return this.generarAsignacion(nodo);
            
            case 'BLOQUE':
                return this.generarBloque(nodo);
            
            case 'IF':
                return this.generarIf(nodo);
            
            case 'IF_ELSE':
                return this.generarIfElse(nodo);
            
            case 'WHILE':
                return this.generarWhile(nodo);
            
            case 'PRINT':
                return this.generarPrint(nodo);

            default:
                throw new Error(`Tipo de nodo no reconocido: ${nodo.tipo} en ${nodo.getPosicion()}`);
        }
    }

    generarPrograma(nodo) {
        const sentencias = nodo.hijos.map(hijo => this.procesarNodo(hijo));
        return new Bloque(sentencias, nodo.linea, nodo.columna);
    }

    generarOperacionBinaria(nodo) {
        if (nodo.hijos.length !== 2) {
            throw new Error(`Operación binaria ${nodo.tipo} debe tener exactamente 2 hijos en ${nodo.getPosicion()}`);
        }

        const izquierda = this.procesarNodo(nodo.hijos[0]);
        const derecha = this.procesarNodo(nodo.hijos[1]);
        
        return new OperacionBinaria(izquierda, nodo.tipo, derecha, nodo.linea, nodo.columna);
    }

    generarOperacionUnaria(nodo) {
        if (nodo.hijos.length !== 1) {
            throw new Error(`Operación unaria ${nodo.tipo} debe tener exactamente 1 hijo en ${nodo.getPosicion()}`);
        }

        const operando = this.procesarNodo(nodo.hijos[0]);
        const operador = nodo.tipo === 'MENOS_UNARIO' ? 'MENOS' : nodo.tipo;
        
        return new OperacionUnaria(operador, operando, nodo.linea, nodo.columna);
    }

    generarAsignacion(nodo) {
        if (nodo.hijos.length !== 2) {
            throw new Error(`Asignación debe tener exactamente 2 hijos en ${nodo.getPosicion()}`);
        }

        const identificador = this.procesarNodo(nodo.hijos[0]);
        const expresion = this.procesarNodo(nodo.hijos[1]);

        identificador.acceso = false;
        
        return new Asignacion(identificador, expresion, nodo.linea, nodo.columna);
    }

    generarBloque(nodo) {
        const sentencias = nodo.hijos.map(hijo => this.procesarNodo(hijo));
        return new Bloque(sentencias, nodo.linea, nodo.columna);
    }

    generarIf(nodo) {
        if (nodo.hijos.length !== 2) {
            throw new Error(`IF debe tener exactamente 2 hijos en ${nodo.getPosicion()}`);
        }

        const condicion = this.procesarNodo(nodo.hijos[0]);
        const sentenciaVerdadera = this.procesarNodo(nodo.hijos[1]);
        
        return new If(condicion, sentenciaVerdadera, null, nodo.linea, nodo.columna);
    }

    generarIfElse(nodo) {
        if (nodo.hijos.length !== 3) {
            throw new Error(`IF-ELSE debe tener exactamente 3 hijos en ${nodo.getPosicion()}`);
        }

        const condicion = this.procesarNodo(nodo.hijos[0]);
        const sentenciaVerdadera = this.procesarNodo(nodo.hijos[1]);
        const sentenciaFalsa = this.procesarNodo(nodo.hijos[2]);
        
        return new If(condicion, sentenciaVerdadera, sentenciaFalsa, nodo.linea, nodo.columna);
    }

    generarWhile(nodo) {
        if (nodo.hijos.length !== 2) {
            throw new Error(`WHILE debe tener exactamente 2 hijos en ${nodo.getPosicion()}`);
        }

        const condicion = this.procesarNodo(nodo.hijos[0]);
        const sentencia = this.procesarNodo(nodo.hijos[1]);
        
        return new While(condicion, sentencia, nodo.linea, nodo.columna);
    }

    generarPrint(nodo) {
        const expresiones = nodo.hijos.map(hijo => this.procesarNodo(hijo));
        return new Print(expresiones, nodo.linea, nodo.columna);
    }

    getErrores() {
        return this.errores;
    }

    limpiarErrores() {
        this.errores = [];
    }
}

module.exports = GeneradorInstancias;