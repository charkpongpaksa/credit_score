import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: boolean
  noBorder?: boolean
}

export default function Card({ 
  children, 
  className = "",
  padding = true, 
  noBorder = false,
  ...props
}: CardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-card transition-all duration-300
        ${padding ? 'p-6' : 'p-0'} 
        ${noBorder ? '' : 'border border-[rgba(195,198,215,0.2)]'} 
        ${className}`
      }
      {...props}
    >
      {children}
    </div>
  )
}
