import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Input = forwardRef(({ 
  className,
  type = "text",
  icon,
  error,
  label,
  placeholder,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed",
            icon && "pl-11",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input