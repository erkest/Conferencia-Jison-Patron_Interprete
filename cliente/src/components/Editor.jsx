import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { javascript } from '@codemirror/lang-javascript';

const Editor = ({ value, onChange, placeholder = "Escribe tu código aquí..." }) => {
  const [code, setCode] = useState(value || '');

  // Actualizar el estado local cuando cambie el value prop
  useEffect(() => {
    setCode(value || '');
  }, [value]);

  const handleChange = (val) => {
    setCode(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CodeMirror
        value={code}
        onChange={handleChange}
        theme={okaidia}
        extensions={[javascript()]}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
        }}
        style={{
          fontSize: '14px',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          border: '1px solid #3e3e3e',
          borderRadius: '6px',
          flex: 1
        }}
        height="100%"
      />
    </div>
  );
};

export default Editor;