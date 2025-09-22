import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-glow transform hover:scale-105 focus:ring-primary/30",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary/30",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary focus:ring-primary/30",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-error/30",
    success: "bg-gradient-to-r from-success to-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-success/30"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  }
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "hover:scale-100 hover:shadow-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="mr-2 animate-spin" 
        />
      )}
      
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-2" 
        />
      )}
      
      {children}
      
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="ml-2" 
        />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button