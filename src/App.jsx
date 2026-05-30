import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar.jsx'
import Header from './components/layout/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CallerIdConfig from './pages/CallerIdConfig.jsx'

const TITULOS = {
  '/': {
    titulo: 'Dashboard de Monitoramento',
    subtitulo: 'Chamadas manuais de saída via PBX',
  },
  '/caller-id': {
    titulo: 'Configuração de Caller ID',
    subtitulo: 'Defina o número A exibido nas chamadas de saída',
  },
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const meta = TITULOS[location.pathname] || TITULOS['/']

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          titulo={meta.titulo}
          subtitulo={meta.subtitulo}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/caller-id" element={<CallerIdConfig />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
