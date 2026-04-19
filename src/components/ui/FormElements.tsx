import React from 'react'

export interface FieldProps {
  label?: string
  children: React.ReactNode
  hint?: string
  error?: string
}

export const Field = ({ label, children, hint, error }: FieldProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label className="text-[13px] font-medium text-slate-700">
        {label}
      </label>
    )}
    {children}
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    {error && <p className="text-[11px] text-risk-high-dark font-medium">{error}</p>}
  </div>
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
}

export const Input = ({ prefix, className = "", ...props }: InputProps) => (
  <div className="relative w-full">
    {prefix && (
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">
        {prefix}
      </span>
    )}
    <input 
      {...props} 
      className={`form-input w-full px-4 py-2.5 bg-white border border-[rgba(195,198,215,0.5)] rounded-xl text-sm transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 
        ${prefix ? 'pl-8' : 'pl-4'} 
        ${className}`
      } 
    />
  </div>
)

export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<SelectOption | string>
  placeholder?: string
}

export const Select = ({ options = [], placeholder, className = "", ...props }: SelectProps) => (
  <div className="relative w-full">
    <select 
      {...props} 
      className={`w-full px-4 py-2.5 pr-10 bg-white border border-[rgba(195,198,215,0.5)] rounded-xl text-sm appearance-none focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => {
        const value = typeof o === 'string' ? o : o.value
        const label = typeof o === 'string' ? o : o.label
        return (
          <option key={value} value={value}>
            {label}
          </option>
        )
      })}
    </select>
    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 !text-[18px] text-slate-500 pointer-events-none">
      expand_more
    </span>
  </div>
)
