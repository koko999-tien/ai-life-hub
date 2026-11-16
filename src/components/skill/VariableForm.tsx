'use client'

import { PromptVariable } from '@/types'
import { cn } from '@/lib/utils'
import { VARIABLE_TYPE_LABELS } from '@/lib/constants'
import {
  ChevronDown,
  X,
  Calendar,
  Hash,
  Type,
  List,
  type LucideIcon,
} from 'lucide-react'
import { useId } from 'react'

const VARIABLE_TYPE_ICONS: Record<PromptVariable['type'], LucideIcon> = {
  text: Type,
  textarea: Type,
  select: ChevronDown,
  multiselect: List,
  number: Hash,
  date: Calendar,
}

interface VariableFormProps {
  variables: PromptVariable[]
  values?: Record<string, string>
  onChange?: (name: string, value: string) => void
  readOnly?: boolean
  className?: string
}

function TextInput({
  id,
  label,
  description,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  error,
}: {
  id: string
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={description ? `${id}-desc` : error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors',
          'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          disabled
            ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-70'
            : error
            ? 'border-red-300 dark:border-red-700'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
        )}
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function TextareaInput({
  id,
  label,
  description,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  error,
  rows = 4,
}: {
  id: string
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  rows?: number
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        aria-describedby={description ? `${id}-desc` : error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors resize-y min-h-[80px]',
          'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          disabled
            ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-70'
            : error
            ? 'border-red-300 dark:border-red-700'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
        )}
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function SelectInput({
  id,
  label,
  description,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
  placeholder,
}: {
  id: string
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  required?: boolean
  disabled?: boolean
  error?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-describedby={description ? `${id}-desc` : error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={cn(
            'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors appearance-none pr-10',
            'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            disabled
              ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-70'
              : error
              ? 'border-red-300 dark:border-red-700'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          )}
        >
          <option value="" disabled>
            {placeholder || 'Select an option'}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
        </div>
      </div>
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function MultiselectInput({
  id,
  label,
  description,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
}: {
  id: string
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  required?: boolean
  disabled?: boolean
  error?: string
}) {
  const selectedValues = value ? value.split(',').map((v) => v.trim()).filter(Boolean) : []
  const availableOptions = options.filter((opt) => !selectedValues.includes(opt))

  const handleAdd = (option: string) => {
    const newValues = [...selectedValues, option]
    onChange(newValues.join(', '))
  }

  const handleRemove = (option: string) => {
    const newValues = selectedValues.filter((v) => v !== option)
    onChange(newValues.join(', '))
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>

      {/* Selected chips */}
      <div className="flex flex-wrap gap-1.5 min-h-[38px]">
        {selectedValues.map((val) => (
          <span
            key={val}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium"
          >
            {val}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(val)}
                className="p-0.5 rounded hover:bg-brand-200 dark:hover:bg-brand-800/50"
                aria-label={`Remove ${val}`}
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </span>
        ))}
        {!disabled && availableOptions.length > 0 && (
          <select
            id={`${id}-select`}
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) handleAdd(e.target.value)
              e.target.value = ''
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Add option"
          >
            <option value="" disabled selected>
              + Add
            </option>
            {availableOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function NumberInput({
  id,
  label,
  description,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  error,
  min,
  max,
  step,
}: {
  id: string
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <input
        type="number"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-describedby={description ? `${id}-desc` : error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors',
          'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          disabled
            ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-70'
            : error
            ? 'border-red-300 dark:border-red-700'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
        )}
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function DateInput({
  id,
  label,
  description,
  value,
  onChange,
  required,
  disabled,
  error,
}: {
  id: string
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <input
          type="date"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-describedby={description ? `${id}-desc` : error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={cn(
            'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors pr-10',
            'focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            disabled
              ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-70'
              : error
              ? 'border-red-300 dark:border-red-700'
              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
        </div>
      </div>
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function ReadOnlyVariable({
  variable,
  value,
}: {
  variable: PromptVariable
  value: string
}) {
  const Icon = VARIABLE_TYPE_ICONS[variable.type]
  const displayValue = value || variable.default || '—'

  return (
    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-slate-400" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {VARIABLE_TYPE_LABELS[variable.type]}
        </span>
        {variable.required && (
          <span className="text-xs text-red-500" aria-hidden="true">*</span>
        )}
      </div>
      <p className="font-medium text-slate-900 dark:text-slate-100">{variable.label}</p>
      {variable.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{variable.description}</p>
      )}
      <div className="mt-2 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-700 dark:text-slate-300 break-all">
        {displayValue}
      </div>
    </div>
  )
}

export function VariableForm({
  variables,
  values = {},
  onChange,
  readOnly = false,
  className,
}: VariableFormProps) {
  const generateId = useId()

  if (readOnly) {
    return (
      <div className={cn('grid gap-3 sm:grid-cols-2', className)}>
        {variables.map((variable) => (
          <ReadOnlyVariable
            key={variable.name}
            variable={variable}
            value={values[variable.name] || ''}
          />
        ))}
      </div>
    )
  }

  const handleChange = (name: string, value: string) => {
    onChange?.(name, value)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {variables.map((variable) => {
        const id = `${generateId}-${variable.name}`
        const value = values[variable.name] || variable.default || ''
        const error = variable.required && !value.trim() ? `${variable.label} is required` : undefined

        switch (variable.type) {
          case 'text':
            return (
              <TextInput
                key={variable.name}
                id={id}
                label={variable.label}
                description={variable.description}
                value={value}
                onChange={(v) => handleChange(variable.name, v)}
                placeholder={variable.description}
                required={variable.required}
                error={error}
              />
            )

          case 'textarea':
            return (
              <TextareaInput
                key={variable.name}
                id={id}
                label={variable.label}
                description={variable.description}
                value={value}
                onChange={(v) => handleChange(variable.name, v)}
                placeholder={variable.description}
                required={variable.required}
                error={error}
                rows={5}
              />
            )

          case 'select':
            return (
              <SelectInput
                key={variable.name}
                id={id}
                label={variable.label}
                description={variable.description}
                value={value}
                onChange={(v) => handleChange(variable.name, v)}
                options={variable.options || []}
                required={variable.required}
                error={error}
                placeholder={`Select ${variable.label.toLowerCase()}`}
              />
            )

          case 'multiselect':
            return (
              <MultiselectInput
                key={variable.name}
                id={id}
                label={variable.label}
                description={variable.description}
                value={value}
                onChange={(v) => handleChange(variable.name, v)}
                options={variable.options || []}
                required={variable.required}
                error={error}
              />
            )

          case 'number':
            return (
              <NumberInput
                key={variable.name}
                id={id}
                label={variable.label}
                description={variable.description}
                value={value}
                onChange={(v) => handleChange(variable.name, v)}
                placeholder={variable.description}
                required={variable.required}
                error={error}
              />
            )

          case 'date':
            return (
              <DateInput
                key={variable.name}
                id={id}
                label={variable.label}
                description={variable.description}
                value={value}
                onChange={(v) => handleChange(variable.name, v)}
                required={variable.required}
                error={error}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}