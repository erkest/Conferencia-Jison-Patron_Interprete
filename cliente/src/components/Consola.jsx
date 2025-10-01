import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { consoleDark } from '@uiw/codemirror-theme-console';

const Consola = ({ output = [], onClear, readOnly = true }) => {
  const [consoleOutput, setConsoleOutput] = useState('');

  useEffect(() => {
    if (Array.isArray(output)) {
      setConsoleOutput(output.join('\n'));
    } else if (typeof output === 'string') {
      setConsoleOutput(output);
    }
  }, [output]);

  const handleClear = () => {
    setConsoleOutput('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px' 
      }}>
        <h2 style={{ 
          color: '#00ff00', 
          margin: 0,
          fontSize: '1.3rem',
          fontWeight: '500'
        }}>
          Consola
        </h2>
        {output.length > 0 && (
          <span style={{ 
            color: '#888', 
            fontSize: '12px',
            backgroundColor: '#333',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {output.length} línea{output.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <CodeMirror
          value={consoleOutput}
          theme={consoleDark}
          readOnly={readOnly}
          placeholder={output.length === 0 ? "La salida del programa aparecerá aquí..." : ""}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
            bracketMatching: false,
            closeBrackets: false,
            autocompletion: false,
            highlightSelectionMatches: false,
            searchKeymap: false,
          }}
          style={{
            fontSize: '13px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            border: '1px solid #333',
            borderRadius: '6px',
          }}
          height="100%"
        />
      </div>
    </div>
  );
};

export default Consola;