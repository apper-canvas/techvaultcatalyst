import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No items found",
  description = "It looks like there's nothing here yet.",
  actionLabel = "Get Started",
  onAction,
  icon = "Package",
  className,
  ...props 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-xl shadow-soft p-8 text-center border border-gray-100",
      className
    )} {...props}>
      {/* Empty State Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center mb-6 shadow-soft">
        <ApperIcon 
          name={icon} 
          size={40} 
          className="text-primary/60" 
        />
      </div>
      
      {/* Empty State Content */}
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        
        {/* Action Button */}
        {onAction && (
          <div className="pt-4">
            <Button
              variant="primary"
              icon="Plus"
              onClick={onAction}
              className="shadow-soft hover:shadow-glow transform hover:scale-105"
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl"></div>
      </div>
    </div>
  )
}

export default Empty