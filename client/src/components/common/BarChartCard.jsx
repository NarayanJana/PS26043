import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BarChartCard({ title, data, color = '#F5A623', valueLabel = 'Count' }) {
  return (
    <div className="bg-panel border border-panelLight rounded-lg p-6">
      <h3 className="font-display text-sm font-semibold text-ink50 mb-4">{title}</h3>
      {!data || data.length === 0 ? (
        <p className="text-sm text-inkMuted">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1B2740" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#8794AC', fontSize: 11 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fill: '#8794AC', fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121B2E',
                border: '1px solid #1B2740',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#E8ECF4' }}
              formatter={(value) => [value, valueLabel]}
            />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}