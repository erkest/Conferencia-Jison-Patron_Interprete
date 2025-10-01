const parser = require('../gramatica/gramatica'); // Parser generado por Jison
const Interprete = require('../analizador_semantico/interprete');
const GeneradorInstancias = require('../analizador_semantico/generadorInstancias');
const Nodo = require('../analizador_semantico/abstract/nodo');
const fs = require('fs');
const path = require('path');

class AnalizadorCompleto {
    constructor() {
        this.parser = parser;
        this.interprete = new Interprete();
        this.generador = new GeneradorInstancias();
    }

    analizarYEjecutar(codigo) {
        try {
            console.log('Iniciando análisis y ejecución del código...');
            // Fase 1: Análisis sintáctico con Jison (genera AST de nodos)
            const astNodos = this.parser.parse(codigo);
            console.log(JSON.stringify(astNodos, null, 2));
            
            // Fase 2: Generación de instancias específicas
            const astInstancias = this.generador.generar(astNodos);
            
            // Fase 3: Análisis semántico y ejecución con el intérprete
            const resultado = this.interprete.interpretar(astInstancias);
            
            // Generar DOT del AST
            const dotAST = this.generarDotAST(astNodos);
            
            return {
                dotAST: dotAST,
                ...resultado
            };
        } catch (error) {
            console.error('Error durante el análisis o la ejecución:', error.message);
            return {
                exito: false,
                error: error.message,
                resultado: null,
                salida: [],
                variables: new Map(),
                errores: [error.message],
                dotAST: null
            };
        } finally {
            this.reiniciar();
        }
    }

    // Genera el código DOT completo para el AST
    generarDotAST(astNodos) {
        if (!astNodos) {
            return "digraph G {\n  // AST vacío\n}";
        }
        
        // Reiniciar contador para generar IDs únicos
        Nodo.reiniciarContador();
        
        // Generar el contenido DOT
        let dot = "digraph G {\n";
        dot += "  node [shape=circle, fontname=\"Arial\"];\n";
        dot += "  edge [fontname=\"Arial\"];\n\n";
        
        // Generar el grafo del AST
        dot += "  " + astNodos.graficar();
        
        dot += "}";
        
        // Guardar el archivo DOT en la carpeta analizador
        try {
            const nombreArchivo = 'ast.dot';
            const rutaArchivo = path.join(__dirname, nombreArchivo);
            
            fs.writeFileSync(rutaArchivo, dot, 'utf8');
            console.log(`Archivo DOT guardado en: ${rutaArchivo}`);
        } catch (error) {
            console.error('Error al guardar el archivo DOT:', error.message);
        }
        
        return dot;
    }


    reiniciar() {
        this.interprete.reiniciar();
        this.generador.limpiarErrores();
    }

    getEstado() {
        return this.interprete.getEstado();
    }
}

module.exports = AnalizadorCompleto;