// client/src/components/ui/ThemeToggle.jsx

import { useTheme } from '../../context/ThemeContext';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <HiOutlineSun className='w-5 h-5 text-yellow-500' />
      ) : (
        <HiOutlineMoon className='w-5 h-5 text-gray-600' />
      )}
    </button>
  );
}

export default ThemeToggle;
