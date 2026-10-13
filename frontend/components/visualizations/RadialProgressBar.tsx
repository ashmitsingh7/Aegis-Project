interface RadialProgressBarProps {
  progress: number; // 0-100
  label: string;
  size?: number;
}

const RadialProgressBar = ({ progress, label, size = 100 }: RadialProgressBarProps) => {
  // Determine color based on progress
  let progressColor = '#ef4444'; // red by default
  if (progress >= 80) progressColor = '#10b981'; // green
  else if (progress >= 60) progressColor = '#f59e0b'; // amber
  else if (progress >= 40) progressColor = '#f97316'; // orange

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{label}</h3>
      <div className="relative inline-flex" style={{ width: size, height: size }}>
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            stroke="#e5e7eb"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            stroke={progressColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          {/* Center text */}
          <text
            x="50"
            y="52"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#374151"
          >
            {progress}%
          </text>
          <text
            x="50"
            y="70"
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {label.toLowerCase().includes('life') ? 'Remaining' : ''}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default RadialProgressBar;