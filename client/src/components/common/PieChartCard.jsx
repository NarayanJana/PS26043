import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#F5A623', '#2DD4BF', '#8794AC', '#3B82F6', '#F87171', '#A78BFA'];

export default function PieChartCard({ title, data }) {
  return (
    <div className="bg-panel border border-panelLight rounded-lg p-6">
      <h3 className="font-display text-sm font-semibold text-ink50 mb-4">{title}</h3>
      {!data || data.length === 0 ? (
        <p className="text-sm text-inkMuted">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#121B2E',
                border: '1px solid #1B2740',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: '#8794AC' }}
              formatter={(value) => <span style={{ color: '#8794AC' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}