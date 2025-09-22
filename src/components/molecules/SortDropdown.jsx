import React, { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const SortDropdown = ({ 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "name", label: "Name: A to Z" },
    { value: "newest", label: "Newest First" }
  ]
  
  const currentOption = sortOptions.find(option => option.value === value) || sortOptions[0]
  
  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }
  
  return (
    <div className={cn("relative", className)} {...props}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Sort by: {currentOption.label}</span>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16}
          className="ml-2 transition-transform duration-200"
        />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 w-full min-w-[200px] mt-2 bg-white rounded-lg shadow-soft-lg border border-gray-200 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between",
                  value === option.value && "bg-primary/5 text-primary font-medium"
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
                {value === option.value && (
                  <ApperIcon name="Check" size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SortDropdown