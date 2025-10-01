import { useState } from 'react'
import './App.css'
import Editor from './components/Editor'
import Consola from './components/Consola'

function App() {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  const handleExecute = async () => {
    if (!code.trim()) {
      setOutput(['Error: No hay código para ejecutar'])
      return
    }
    
    setIsLoading(true)
    const timestamp = new Date().toLocaleTimeString()
    setOutput([...output, `[${timestamp}] Analizando código...`])

    try {
      const response = await fetch('http://localhost:3000/analizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: code }),
      })

      const data = await response.json()
      
      if (data.exito) {
        const newOutput = [
          ...output,
          `[${timestamp}] Análisis completado exitosamente`,
          '--- RESULTADO DEL ANÁLISIS ---'
        ]

        // Agregar salida del programa si existe
        if (data.salida && data.salida.length > 0) {
          newOutput.push('SALIDA:')
          data.salida.forEach(linea => {
            newOutput.push(`  ${linea}`)
          })
        }

        // Agregar variables si existen
        if (data.variables && Object.keys(data.variables).length > 0) {
          newOutput.push('VARIABLES:')
          Object.entries(data.variables).forEach(([nombre, valor]) => {
            newOutput.push(`  ${nombre} = ${valor}`)
          })
        }

        // Agregar errores si existen
        if (data.errores && data.errores.length > 0) {
          newOutput.push('ERRORES:')
          data.errores.forEach(error => {
            newOutput.push(`  ${error}`)
          })
        }

        setOutput(newOutput)
      } else {
        setOutput([
          ...output,
          `[${timestamp}] Error en el análisis:`,
          `${data.error}`,
          ...(data.errores || []).map(err => `   ${err}`)
        ])
      }
    } catch (error) {
      setOutput([
        ...output,
        `[${timestamp}] Error de conexión:`,
        `No se pudo conectar con el servidor: ${error.message}`,
        'Asegúrate de que el servidor esté ejecutándose en http://localhost:3000'
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = () => {
    setCode('')
    setOutput([])
  }

  return (
    <div style={{ 
      backgroundColor: '#1e1e1e', 
      minHeight: '100vh', 
      padding: '0',
      margin: '0',
      width: '100vw',
      boxSizing: 'border-box',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '10px',
        borderBottom: '2px solid #333',
        paddingBottom: '10px',
        padding: '10px 5px'
      }}>
        <h1 style={{ 
          color: '#f8f8f2', 
          margin: 0,
          fontSize: '2.5rem',
          fontWeight: '300',
          letterSpacing: '2px'
        }}>
          Analizador de Código
        </h1>
        <p style={{ 
          color: '#888', 
          margin: '10px 0 0 0',
          fontSize: '1.1rem'
        }}>
          Análisis Sintáctico y Semántico
        </p>
      </header>
      
      {/* Main Content */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '5px',
        width: '100%',
        margin: '0',
        padding: '0 5px',
        boxSizing: 'border-box',
        height: 'calc(100vh - 120px)'
      }}>
        {/* Editor Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '10px' 
          }}>
            <h2 style={{ 
              color: '#f8f8f2', 
              margin: 0,
              fontSize: '1.3rem',
              fontWeight: '500'
            }}>
              Editor
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleClearAll}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                Limpiar Todo
              </button>
              <button 
                onClick={handleExecute}
                disabled={!code.trim() || isLoading}
                style={{
                  backgroundColor: (!code.trim() || isLoading) ? '#555' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: (!code.trim() || isLoading) ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onMouseOver={(e) => {
                  if (code.trim() && !isLoading) e.target.style.backgroundColor = '#219a52'
                }}
                onMouseOut={(e) => {
                  if (code.trim() && !isLoading) e.target.style.backgroundColor = '#27ae60'
                }}
              >
                {isLoading ? 'Analizando...' : 'Analizar'}
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Editor 
              value={code} 
              onChange={handleCodeChange}
              placeholder="// Escribe tu código aquí para análisis sintáctico y semántico..."
            />
          </div>
        </div>
        
        {/* Console Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ flex: 1 }}>
            <Consola 
              output={output}
              onClear={handleClearAll}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '5px',
        borderTop: '1px solid #333',
        paddingTop: '5px',
        padding: '5px'
      }}>
        <p style={{ 
          color: '#666', 
          margin: 0,
          fontSize: '0.9rem'
        }}>
          Conectado al servidor de análisis • http://localhost:3000
        </p>
      </footer>
    </div>
  )
}

export default App
