export default function Card({ 
  children, 
  style = {}, 
  padding = 24, 
  borderRadius = 20,
  border = '1px solid rgba(195, 198, 215, 0.2)',
  boxShadow = '0 2px 8px rgba(15,23,42,0.04)'
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius,
      padding,
      boxShadow,
      border,
      ...style
    }}>
      {children}
    </div>
  )
}
