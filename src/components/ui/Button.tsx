'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerFilled'
  fullWidth?: boolean
  icon?: string
  loading?: boolean
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  fullWidth = false,
  icon: Icon,
  loading = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "py-2.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
  const widthClass = fullWidth ? "w-full" : "w-auto"
  const disabledClass = (disabled || loading) ? "opacity-60 cursor-default" : "cursor-pointer active:scale-[0.98]"

  const variants = {
    primary: "bg-gradient-to-br from-[#004ac6] to-[#2563eb] text-white shadow-brand hover:opacity-90",
    secondary: "bg-white text-[#171c1f] border border-[rgba(195,198,215,0.5)] hover:bg-slate-50",
    ghost: "bg-transparent text-brand hover:bg-brand/5",
    danger: "bg-transparent text-risk-high-dark hover:bg-risk-high-dark/5",
    dangerFilled: "bg-risk-high-dark text-white hover:opacity-90 shadow-lg shadow-risk-high-dark/20"
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClasses} ${widthClass} ${disabledClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin !text-[18px]">sync</span>
      ) : Icon && (
        <span className="material-symbols-outlined !text-[18px]">{Icon}</span>
      )}
      {children}
    </button>
  )
}
