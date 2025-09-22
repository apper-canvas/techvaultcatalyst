import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Rating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = "sm",
  showNumber = true,
  reviewCount,
  className,
  ...props 
}) => {
  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24
  }
  
  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const isFilled = index < Math.floor(rating)
          const isHalfFilled = index < rating && index >= Math.floor(rating)
          
          return (
            <div key={index} className="relative">
              <ApperIcon
                name="Star"
                size={iconSizes[size]}
                className={cn(
                  "transition-colors duration-200",
                  isFilled ? "text-warning fill-warning" : "text-gray-300"
                )}
              />
              {isHalfFilled && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                  <ApperIcon
                    name="Star"
                    size={iconSizes[size]}
                    className="text-warning fill-warning"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {showNumber && (
        <span className={cn("font-medium text-gray-700", textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {reviewCount && (
        <span className={cn("text-gray-500", textSizes[size])}>
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  )
}

export default Rating