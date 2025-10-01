# Ejemplo sencillo de Jison
## Instalación de Jison
```bash
# Instalar Jison globalmente
npm install -g jison
```

## Ejecución
Primero se debe generar el parser desde la gramática definida en `gramatica.jison`:
```bash
jison gramatica.jison
```

Luego, se puede ejecutar el archivo `index.js` que utiliza el parser generado:
```bash
node index.js
```