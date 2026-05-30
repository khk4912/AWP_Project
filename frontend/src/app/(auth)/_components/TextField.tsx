import type { InputHTMLAttributes, ReactNode } from 'react'

type TextFieldProps = {
  name: string
  type: string
  placeholder: string
  icon?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'placeholder'>

export default function TextField ({ name, type, placeholder, icon, ...inputProps }: TextFieldProps) {
  return (
    <label className='block'>
      <span className='sr-only'>{placeholder}</span>

      <div className='flex h-12 items-center gap-3
                      rounded-2xl border border-gray-300 bg-white px-5
                      transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
                      sm:h-14 sm:px-6'
      >
        {icon != null
          ? <span className='flex h-5 w-5 shrink-0 items-center justify-center text-gray-400'>{icon}</span>
          : null}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className='min-w-0 flex-1 bg-transparent text-base font-medium text-gray-950 outline-none placeholder:text-gray-500 sm:text-lg'
          {...inputProps}
        />
      </div>
    </label>
  )
}
