import { Menu, Search, Bell, ChevronDown } from 'lucide-react'

export default function Header({ titulo, subtitulo, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-slate-800 sm:text-lg">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="hidden truncate text-xs text-slate-400 sm:block">
            {subtitulo}
          </p>
        )}
      </div>

      {/* Busca (decorativa) */}
      <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar chamada, operador..."
          className="w-48 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <button
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      {/* Usuário */}
      <button className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          SP
        </span>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-semibold text-slate-700">Supervisor</p>
          <p className="text-[11px] text-slate-400">supervisor@zero2one</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
      </button>
    </header>
  )
}
