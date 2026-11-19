'use client'

import { PromptVariable } from '@/types'
import { cn } from '@/lib/utils'
import { VARIABLE_TYPE_LABELS } from '@/lib/constants'
import { normalizeVariableValue } from './categoryHelpers'
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
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-400" aria-hidden="true">*</span>}
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
          'w-full px-3.5 py-2.5 rounded-xl border bg-bg text-text text-sm placeholder:text-text-muted/60 transition-colors',
          'focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent',
          disabled
            ? 'opacity-60 cursor-not-allowed'
            : error
            ? 'border-red-400'
            : 'border-border hover:border-accent/40'
        )}
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 flex items-center gap-1">
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
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-400" aria-hidden="true">*</span>}
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
          'w-full px-3.5 py-2.5 rounded-xl border bg-bg text-text text-sm placeholder:text-text-muted/60 transition-colors resize-y min-h-[90px]',
          'focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent leading-relaxed',
          disabled
            ? 'opacity-60 cursor-not-allowed'
            : error
            ? 'border-red-400'
            : 'border-border hover:border-accent/40'
        )}
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 flex items-center gap-1">
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
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-400" aria-hidden="true">*</span>}
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
            'w-full px-3.5 py-2.5 rounded-xl border bg-bg text-text text-sm transition-colors appearance-none pr-10',
            'focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent',
            disabled
              ? 'opacity-60 cursor-not-allowed'
              : error
              ? 'border-red-400'
              : 'border-border hover:border-accent/40'
          )}
        >
          <option value="" disabled>
            {placeholder || 'Chọn một tùy chọn'}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 flex items-center gap-1">
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
  const normalizedValue = normalizeVariableValue(value)
  const selectedValues = normalizedValue
    ? normalizedValue.split(',').map((v) => v.trim()).filter(Boolean)
    : []
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
      <label
        htmlFor={`${id}-select`}
        className="block text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5"
      >
        {label}
        {required && <span className="text-red-400" aria-hidden="true">*</span>}
      </label>

      {/* Selected chips */}
      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-1.5 rounded-xl bg-bg border border-border">
        {selectedValues.map((val) => (
          <span
            key={val}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium"
          >
            {val}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(val)}
                className="p-0.5 rounded hover:bg-accent/20 text-accent"
                aria-label={`Xóa ${val}`}
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </span>
        ))}
        {!disabled && availableOptions.length > 0 && (
          <select
            id={`${id}-select`}
            value=""
            onChange={(e) => {
              if (e.target.value) handleAdd(e.target.value)
            }}
            aria-describedby={description ? `${id}-desc` : error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            className="px-2.5 py-1 rounded-lg border border-border bg-bg-surface text-xs text-text cursor-pointer hover:border-accent focus:outline-hidden"
            aria-label={`Thêm ${label.toLowerCase()}`}
          >
            <option value="" disabled>
              + Thêm
            </option>
            {availableOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-text-muted">{description}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 flex items-center gap-1">
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
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-400" aria-hidden="true">*</span>}
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
          'w-full px-3.5 py-2.5 rounded-xl border bg-bg text-text text-sm placeholder:text-text-muted/60 transition-colors',
          'focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent',
          disabled
            ? 'opacity-60 cursor-not-allowed'
            : error
            ? 'border-red-400'
            : 'border-border hover:border-accent/40'
        )}
      />
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 flex items-center gap-1">
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
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
        {label}
        {required && <span className="text-red-400" aria-hidden="true">*</span>}
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
            'w-full px-3.5 py-2.5 rounded-xl border bg-bg text-text text-sm transition-colors pr-10',
            'focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent',
            disabled
              ? 'opacity-60 cursor-not-allowed'
              : error
              ? 'border-red-400'
              : 'border-border hover:border-accent/40'
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
          <Calendar className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
      {description && !error && (
        <p id={`${id}-desc`} className="text-xs text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 flex items-center gap-1">
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
  const normalizedValue = normalizeVariableValue(value)
  const normalizedDefault = normalizeVariableValue(variable.default)
  const displayValue = normalizedValue || normalizedDefault || '—'

  return (
    <div className="p-3.5 rounded-2xl bg-bg border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
        <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">
          {VARIABLE_TYPE_LABELS[variable.type]}
        </span>
        {variable.required && (
          <span className="text-xs text-red-400" aria-hidden="true">*</span>
        )}
      </div>
      <p className="font-semibold text-text text-sm">{variable.label}</p>
      {variable.description && (
        <p className="text-xs text-text-muted mt-0.5">{variable.description}</p>
      )}
      <div className="mt-2 p-2.5 rounded-xl bg-bg-surface border border-border/80 font-mono text-xs text-text break-all">
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
            value={
              variable.name in values
                ? normalizeVariableValue(values[variable.name])
                : ''
            }
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
        const value =
          variable.name in values
            ? normalizeVariableValue(values[variable.name])
            : normalizeVariableValue(variable.default)
        const isInvalid = Boolean(variable.required && !value.trim())
        const error = isInvalid ? `${variable.label} là bắt buộc` : undefined

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
                placeholder={`Chọn ${variable.label.toLowerCase()}`}
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
