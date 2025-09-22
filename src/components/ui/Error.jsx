import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading the content.",
  onRetry,
  className,
  ...props 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-soft p-8 text-center",
      className
    )} {...props}>
      {/* Error Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-red-600/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name="AlertCircle" 
          size={32} 
          className="text-error" 
        />
      </div>
      
      {/* Error Content */}
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          {message}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          {onRetry && (
            <Button
              variant="primary"
              icon="RefreshCw"
              onClick={onRetry}
              className="shadow-soft hover:shadow-soft-lg"
            >
              Try Again
            </Button>
          )}
          
          <Button
            variant="outline"
            icon="Home"
            onClick={() => window.location.href = "/"}
            className="shadow-soft hover:shadow-soft-lg"
          >
            Go Home
          </Button>
        </div>
      </div>
      
      {/* Help Text */}
      <div className="mt-8 text-sm text-gray-500">
        <p>
          If the problem persists, please{" "}
          <a href="#" className="text-primary hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  )
}

export default Error