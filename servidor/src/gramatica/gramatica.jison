/* Definición léxica */
%lex

%%
\s+                     /* ignorar espacios en blanco */
"//".*                  /* comentarios de línea */
"/*"[\s\S]*?"*/"        /* comentarios de bloque */

/* Palabras reservadas */
"while"                 return 'while';
"if"                    return 'if';
"else"                  return 'else';
"print"                 return 'print';

/* Operadores relacionales */
"=="                    return 'igual';
"!="                    return 'diferente';
"<="                    return 'menor_igual';
">="                    return 'mayor_igual';
"<"                     return 'menor';
">"                     return 'mayor';

/* Operadores aritméticos */
"+"                     return 'mas';
"-"                     return 'menos';
"*"                     return 'multiplicacion';
"/"                     return 'division';
"%"                     return 'modulo';

/* Operadores lógicos */
"&&"                    return 'and';
"||"                    return 'or';
"!"                     return 'not';

/* Símbolos */
"="                     return 'asignacion';
"("                     return 'paren_izq';
")"                     return 'paren_der';
"{"                     return 'llave_izq';
"}"                     return 'llave_der';
";"                     return 'punto_coma';
","                     return 'coma';

/* Literales */
[0-9]+("."[0-9]+)?      return 'numero';
\"([^\\\"]|\\.)*\"      return 'cadena';
\'([^\\\']|\\.)*\'      return 'cadena';

/* Identificadores */
[a-zA-Z_][a-zA-Z0-9_]*  return 'identificador';

/* Fin de archivo */
<<EOF>>                 return 'EOF';

/* Caracteres no reconocidos */
.                       {console.log("Error léxico: Carácter no reconocido '" + yytext); };

/lex

%{
    const Nodo = require('../analizador_semantico/abstract/nodo');
%}

/* Precedencia de operadores */
%left 'or'
%left 'and'
%left 'igual' 'diferente'
%left 'menor' 'mayor' 'menor_igual' 'mayor_igual'
%left 'mas' 'menos'
%left 'multiplicacion' 'division' 'modulo'
%right 'not' 'UMENOS'

/* 
La siguiente parte se usa para aprovechar la precedencia que ofrece jison
y evitar problemas en las sentencias if-else, y a la vez simplificar el ejemplo
pero con una buena gramatica se puede evitar el shift/reduce
*/
%nonassoc 'THEN'
%nonassoc 'else'


%start INICIO

%%

INICIO
    : LISTA_SENTENCIAS EOF
        {
            $$ = new Nodo('PROGRAMA', null, $1, @1.first_line, @1.first_column);
            return $$;
        }
    ;

LISTA_SENTENCIAS
    : LISTA_SENTENCIAS SENTENCIA
        {
            $1.push($2);
            $$ = $1;
        }
    | SENTENCIA
        {
            $$ = [$1];
        }
    ;

SENTENCIA
    : SENTENCIA_IF            { $$ = $1; }
    | SENTENCIA_WHILE         { $$ = $1; }
    | SENTENCIA_ASIGNACION    { $$ = $1; }
    | SENTENCIA_PRINT         { $$ = $1; }
    | BLOQUE                  { $$ = $1; }
    ;

SENTENCIA_IF
    : if paren_izq EXPRESION paren_der SENTENCIA %prec THEN
        {
            $$ = new Nodo('IF', null, [$3, $5], @1.first_line, @1.first_column);
        }
    | if paren_izq EXPRESION paren_der SENTENCIA else SENTENCIA
        {
            $$ = new Nodo('IF_ELSE', null, [$3, $5, $7], @1.first_line, @1.first_column);
        }
    ;

SENTENCIA_WHILE
    : while paren_izq EXPRESION paren_der SENTENCIA
        {
            $$ = new Nodo('WHILE', null, [$3, $5], @1.first_line, @1.first_column);
        }
    ;

SENTENCIA_ASIGNACION
    : identificador asignacion EXPRESION punto_coma
        {
            $$ = new Nodo('ASIGNACION', null, [
                new Nodo('IDENTIFICADOR', $1, [], @1.first_line, @1.first_column),
                $3
            ], @1.first_line, @1.first_column);
        }
    ;

SENTENCIA_PRINT
    : print paren_izq LISTA_EXPRESIONES paren_der punto_coma
        {
            $$ = new Nodo('PRINT', null, $3, @1.first_line, @1.first_column);
        }
    ;

BLOQUE
    : llave_izq LISTA_SENTENCIAS llave_der
        {
            $$ = new Nodo('BLOQUE', null, $2, @1.first_line, @1.first_column);
        }
    | llave_izq llave_der
        {
            $$ = new Nodo('BLOQUE', null, [], @1.first_line, @1.first_column);
        }
    ;

LISTA_EXPRESIONES
    : LISTA_EXPRESIONES coma EXPRESION
        {
            $1.push($3);
            $$ = $1;
        }
    | EXPRESION
        {
            $$ = [$1];
        }
    ;

EXPRESION
    : EXPRESION_LOGICA
        { $$ = $1; }
    ;

EXPRESION_LOGICA
    : EXPRESION_LOGICA or EXPRESION_RELACIONAL
        {
            $$ = new Nodo('OR', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_LOGICA and EXPRESION_RELACIONAL
        {
            $$ = new Nodo('AND', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_RELACIONAL
        { $$ = $1; }
    ;

EXPRESION_RELACIONAL
    : EXPRESION_ARITMETICA igual EXPRESION_ARITMETICA
        {
            $$ = new Nodo('IGUAL', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_ARITMETICA diferente EXPRESION_ARITMETICA
        {
            $$ = new Nodo('DIFERENTE', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_ARITMETICA menor EXPRESION_ARITMETICA
        {
            $$ = new Nodo('MENOR', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_ARITMETICA mayor EXPRESION_ARITMETICA
        {
            $$ = new Nodo('MAYOR', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_ARITMETICA menor_igual EXPRESION_ARITMETICA
        {
            $$ = new Nodo('MENOR_IGUAL', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_ARITMETICA mayor_igual EXPRESION_ARITMETICA
        {
            $$ = new Nodo('MAYOR_IGUAL', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_ARITMETICA
        { $$ = $1; }
    ;

EXPRESION_ARITMETICA
    : EXPRESION_ARITMETICA mas TERMINO
        {
            $$ = new Nodo('MAS', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | EXPRESION_ARITMETICA menos TERMINO
        {
            $$ = new Nodo('MENOS', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | TERMINO
        { $$ = $1; }
    ;

TERMINO
    : TERMINO multiplicacion FACTOR
        {
            $$ = new Nodo('MULTIPLICACION', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | TERMINO division FACTOR
        {
            $$ = new Nodo('DIVISION', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | TERMINO modulo FACTOR
        {
            $$ = new Nodo('MODULO', null, [$1, $3], @2.first_line, @2.first_column);
        }
    | FACTOR
        { $$ = $1; }
    ;

FACTOR
    : menos FACTOR %prec UMENOS
        {
            $$ = new Nodo('MENOS_UNARIO', null, [$2], @1.first_line, @1.first_column);
        }
    | not FACTOR
        {
            $$ = new Nodo('NOT', null, [$2], @1.first_line, @1.first_column);
        }
    | paren_izq EXPRESION paren_der
        { $$ = $2; }
    | numero
        {
            $$ = new Nodo('NUMERO', Number($1), [], @1.first_line, @1.first_column);
        }
    | cadena
        {
            $$ = new Nodo('CADENA', $1.substring(1, $1.length - 1), [], @1.first_line, @1.first_column);
        }
    | identificador
        {
            $$ = new Nodo('IDENTIFICADOR', $1, [], @1.first_line, @1.first_column);
        }
    ;
