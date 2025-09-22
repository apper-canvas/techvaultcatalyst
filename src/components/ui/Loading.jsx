import React from "react"
import { cn } from "@/utils/cn"

const Loading = ({ className, ...props }) => {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-32 rounded"></div>
          <div className="skeleton h-10 w-48 rounded-lg"></div>
        </div>
      </div>
      
      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-soft overflow-hidden">
            {/* Image Skeleton */}
            <div className="skeleton aspect-square"></div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="skeleton h-3 w-16 rounded"></div>
              <div className="skeleton h-5 w-full rounded"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
              
              {/* Rating Skeleton */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-4 w-4 rounded"></div>
                  ))}
                </div>
                <div className="skeleton h-3 w-20 rounded"></div>
              </div>
              
              {/* Price Skeleton */}
              <div className="flex items-center gap-2">
                <div className="skeleton h-6 w-20 rounded"></div>
                <div className="skeleton h-4 w-16 rounded"></div>
              </div>
              
              {/* Button Skeleton */}
              <div className="skeleton h-10 w-full rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading