/* Definicion de la sección léxica */
%lex

%options case-insensitive

%%

// palabras reservadas
"inicio"    return 'inicio';
"fin"       { return 'fin' };
","         return ','
// expresiones regulares
[a-zA-ZñÑáéíóú]+ { console.log("Se reconoció un identificador. Lexema: " + yytext);
                   return 'palabra'; }

[ \t\r\n]+  /* ignorar */

<<EOF>>     return 'EOF';

.    { console.log("Carácter no reconocido: " + yytext); }

/lex


/* Definicion de la gramatica */
%start  INICIO

%%

// Gramatica

INICIO : inicio BLOQUE fin EOF {console.log("Análisis finalizado con éxito.");}
       | error EOF {console.log("Se encontró un error de análisis." + $0);}
;

BLOQUE: BLOQUE ',' palabra
      | palabra
;