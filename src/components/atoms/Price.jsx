import React from "react"
import { cn } from "@/utils/cn"

const Price = ({ 
  amount, 
  originalAmount,
  discount,
  size = "md", 
  className,
  showDiscount = true,
  ...props 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price)
  }
  
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl"
  }
  
  const hasDiscount = originalAmount && originalAmount > amount && discount
  
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <span className={cn(
        "font-bold gradient-text",
        sizes[size]
      )}>
        {formatPrice(amount)}
      </span>
      
      {hasDiscount && showDiscount && (
        <>
          <span className={cn(
            "text-gray-500 line-through",
            size === "sm" ? "text-xs" : 
            size === "md" ? "text-sm" :
            size === "lg" ? "text-lg" : "text-xl"
          )}>
            {formatPrice(originalAmount)}
          </span>
          <span className="bg-gradient-to-r from-accent to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        </>
      )}
    </div>
  )
}

export default Price