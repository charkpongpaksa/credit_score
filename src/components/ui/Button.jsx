export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  fullWidth = false,
  icon: Icon,
  style = {}
}) {
  const getStyles = () => {
    const base = {
      padding: '10px 24px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 600,
      cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'Prompt, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
    }

    const variants = {
      primary: {
        background: 'linear-gradient(135deg, #004ac6, #2563eb)',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(0, 74, 198, 0.15)',
      },
      secondary: {
        background: '#fff',
        color: '#171c1f',
        border: '1px solid rgba(195, 198, 215, 0.5)',
      },
      ghost: {
        background: 'none',
        color: '#004ac6',
      },
      danger: {
        background: 'none',
        color: '#ba1a1a',
      },
      dangerFilled: {
        background: '#ba1a1a',
        color: '#fff',
      }
    }

    return { ...base, ...variants[variant], ...style }
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      style={getStyles()}
    >
      {Icon && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{Icon}</span>}
      {children}
    </button>
  )
}
