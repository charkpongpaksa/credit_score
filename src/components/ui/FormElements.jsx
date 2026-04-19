export const Field = ({ label, children, hint, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
    {label && (
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#434655' }}>
        {label}
      </label>
    )}
    {children}
    {hint && <p style={{ fontSize: '11px', color: '#94a3b8' }}>{hint}</p>}
    {error && <p style={{ fontSize: '11px', color: '#ba1a1a' }}>{error}</p>}
  </div>
)

export const Input = ({ prefix, ...props }) => (
  <div style={{ position: 'relative', width: '100%' }}>
    {prefix && (
      <span style={{
        position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
        fontSize: '14px', color: '#64748b',
      }}>{prefix}</span>
    )}
    <input 
      {...props} 
      style={{ 
        paddingLeft: prefix ? '32px' : '16px',
        ...props.style
      }} 
    />
  </div>
)

export const Select = ({ options = [], placeholder, ...props }) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <select {...props} style={{ paddingRight: '36px', ...props.style }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value || o} value={o.value || o}>
          {o.label || o}
        </option>
      ))}
    </select>
    <span className="material-symbols-outlined" style={{
      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
      fontSize: '18px', color: '#64748b', pointerEvents: 'none',
    }}>expand_more</span>
  </div>
)
