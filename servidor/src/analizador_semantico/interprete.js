const Entorno = require('./entorno');
/**
 * Clase principal del intérprete que ejecuta el AST
 */
class Interprete {
    constructor() {
        this.entornoGlobal = new Entorno();
        this.salida = [];
        this.errores = [];
    }

    interpretar(programa) {
        try {
            this.salida = [];
            this.errores = [];
            
            console.log('=== INICIANDO INTERPRETACIÓN ===');
            
            // Ejecutar directamente la instancia del programa
            const resultado = programa.ejecutar ? programa.ejecutar(this.entornoGlobal) : null;
            this.salida = this.entornoGlobal.salida;

            console.log('Resultado de la ejecución:', resultado);
            console.log('Salida capturada:', this.salida);
            console.log('=== FIN INTERPRETACIÓN ===');
            
            // Se retorna de esta manera ya que el frontend espera este formato
            return {
                exito: true,
                resultado: resultado,
                salida: this.salida,
                variables: this.entornoGlobal.getVariables(),
                errores: []
            };
        } catch (error) {
            console.error('Error durante la interpretación:', error);
            this.errores.push(error.message);
            return {
                exito: false,
                resultado: null,
                salida: this.salida,
                variables: this.entornoGlobal.getVariables(),
                errores: this.errores
            };
        }
    }

    /**
     * Reinicia el intérprete limpiando el entorno y los resultados
     */
    reiniciar() {
        this.entornoGlobal = new Entorno();
        this.salida = [];
        this.errores = [];
    }
}

module.exports = Interprete;