import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const SearchBar = ({ className, placeholder = "Search electronics...", onSearch }) => {
  const [query, setQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Initialize query from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchQuery = params.get("q")
    if (searchQuery) {
      setQuery(searchQuery)
      setIsExpanded(true)
    }
  }, [location.search])
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
    if (e.key === "Escape") {
      setIsExpanded(false)
      setQuery("")
    }
  }
  
  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <div className={cn(
        "flex items-center transition-all duration-300",
        isExpanded ? "w-full max-w-lg" : "w-full max-w-md"
      )}>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ApperIcon 
              name="Search" 
              size={20} 
              className="text-gray-400" 
            />
          </div>
          <input
            type="text"
            className={cn(
              "block w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white/80 backdrop-blur-sm",
              isExpanded && "shadow-soft-lg"
            )}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => {
              // Keep expanded if there's a query
              if (!query.trim()) {
                setIsExpanded(false)
              }
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        {query.trim() && (
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon="Search"
            className="ml-2 shadow-soft hover:shadow-soft-lg"
          >
            <span className="hidden sm:inline">Search</span>
          </Button>
        )}
      </div>
      
      {/* Search suggestions could go here */}
      {isExpanded && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-soft-lg border border-gray-200 backdrop-blur-sm z-50 max-h-60 overflow-y-auto">
          {/* Add search suggestions here if needed */}
        </div>
      )}
    </form>
  )
}

export default SearchBar