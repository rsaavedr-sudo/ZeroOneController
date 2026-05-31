import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * EngagementDonut — distribuição acionaram x não acionaram o WhatsApp.
 * data: [{ tipo, valor, cor }]
 */
export default function EngagementDonut({ data }) {
  const total = data.reduce((acc, d) => acc + d.valor, 0)
  const acionaram = data[0]?.valor || 0
  const pct = total ? ((acionaram / total) * 100).toFixed(1).replace('.', ',') : '0'

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative h-56 w-full lg:w-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="valor"
              nameKey="tipo"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.tipo} fill={d.cor} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
              formatter={(valor, nome) => [`${valor} contatos`, nome]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{pct}%</span>
          <span className="text-xs text-slate-400">acionaram</span>
        </div>
      </div>

      <ul className="flex-1 space-y-2">
        {data.map((d) => {
          const p = total ? ((d.valor / total) * 100).toFixed(1).replace('.', ',') : '0'
          return (
            <li key={d.tipo} className="flex items-center gap-3 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.cor }}
              />
              <span className="flex-1 text-slate-600">{d.tipo}</span>
              <span className="font-semibold text-slate-800">{d.valor}</span>
              <span className="w-12 text-right text-xs text-slate-400">{p}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
