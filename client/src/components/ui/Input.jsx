// client/src/components/ui/Input.jsx
// ═══════════════════════════════════════════════════════════════

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      />
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}

export default Input;

/*
EXPLANATION:

Reusable input with:
- Optional label
- Error state styling
- Required indicator
- Focus ring

Usage:
  <Input
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={errors.email}
    required
  />
*/
