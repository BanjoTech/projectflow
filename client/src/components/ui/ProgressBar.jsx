// client/src/components/ui/ProgressBar.jsx
// ═══════════════════════════════════════════════════════════════

function ProgressBar({ progress = 0, size = 'md', showLabel = true }) {
  // Determine color based on progress
  const getColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  // Size variants
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className='w-full'>
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div
          className={`${getColor()} ${
            sizes[size]
          } rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className='text-sm text-gray-600 mt-1'>
          {Math.round(progress)}% complete
        </p>
      )}
    </div>
  );
}

export default ProgressBar;

/*
EXPLANATION:

Shows a progress bar that:
- Changes color based on progress (gray → yellow → blue → green)
- Animates when progress changes
- Optionally shows percentage label

Usage:
  <ProgressBar progress={65} />
  <ProgressBar progress={100} size="lg" showLabel={false} />
*/
