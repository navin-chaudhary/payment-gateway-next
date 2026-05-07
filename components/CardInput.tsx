import React from "react"

interface CardInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  error?: string
  placeholder?: string
  maxLength?: number
  type?: "text" | "tel" | "number" | "select"
  options?: { value: string; label: string }[]
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
  className?: string
}

export function CardInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  placeholder,
  maxLength,
  type = "text",
  options,
  inputMode,
  autoComplete,
  className = "",
}: CardInputProps) {
  const errorId = `${id}-error`
  const hasError = Boolean(error)

  const baseInputClass = `
    w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30
    focus:outline-none focus:ring-2 transition-all duration-200 text-sm
    ${hasError
      ? "border-red-400/70 focus:ring-red-400/40 focus:border-red-400"
      : "border-white/10 focus:ring-purple-400/40 focus:border-purple-400/60"
    }
    ${className}
  `

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-white/70 text-xs font-medium uppercase tracking-wider"
      >
        {label}
      </label>

      {type === "select" && options ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`${baseInputClass} appearance-none cursor-pointer bg-[#1a1a2e]`}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type === "tel" ? "tel" : "text"}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-describedby={hasError ? errorId : undefined}
          aria-invalid={hasError}
          className={baseInputClass}
        />
      )}

      {hasError && (
        <p id={errorId} role="alert" className="text-red-400 text-xs flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
