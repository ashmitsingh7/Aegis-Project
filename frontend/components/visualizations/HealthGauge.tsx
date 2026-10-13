import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface HealthGaugeProps {
  healthScore: number;
  size?: number;
}

const HealthGauge = ({ healthScore, size = 120 }: HealthGaugeProps) => {
  // Determine color based on health score
  let gaugeColor = '#ef4444'; // red by default
  if (healthScore >= 80) gaugeColor = '#10b981'; // green
  else if (healthScore >= 60) gaugeColor = '#f59e0b'; // amber
  else if (healthScore >= 40) gaugeColor = '#f97316'; // orange

  const data = [
    { name: 'Health', value: healthScore },
    { name: 'Remaining', value: 100 - healthScore },
  ];

  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Asset Health</h3>
      <div className="relative inline-block">
        <ResponsiveContainer width={size} height={size}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              dataKey="value"
              nameKey="name"
              label={false}
            >
              <Cell fill={gaugeColor} />
              <Cell fill="#e5e7eb" />
            </Pie>
            <Tooltip
              content={<div className="text-left"><div className="font-bold">Health Score</div><div className="text-gray-600">{healthScore}/100</div></div>}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{healthScore}/100</p>
            <p className="text-xs text-gray-500">
              {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Poor'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthGauge;