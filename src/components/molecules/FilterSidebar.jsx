import React, { useState, useEffect } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import productService from "@/services/api/productService"

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  className,
  isOpen = true,
  onToggle 
}) => {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoading(true)
        const [categoriesData, brandsData] = await Promise.all([
          productService.getCategories(),
          productService.getBrands()
        ])
        setCategories(categoriesData)
        setBrands(brandsData)
      } catch (error) {
        console.error("Error loading filter data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadFilterData()
  }, [])
  
  const handleCategoryChange = (categoryId) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? "all" : categoryId
    })
  }
  
  const handleBrandChange = (brand) => {
    const currentBrands = filters.brand || []
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand]
    
    onFiltersChange({
      ...filters,
      brand: updatedBrands
    })
  }
  
  const handlePriceRangeChange = (min, max) => {
    onFiltersChange({
      ...filters,
      minPrice: min,
      maxPrice: max
    })
  }
  
  const handleInStockChange = (inStockOnly) => {
    onFiltersChange({
      ...filters,
      inStockOnly
    })
  }
  
  const handleRatingChange = (minRating) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === minRating ? null : minRating
    })
  }
  
  const clearAllFilters = () => {
    onFiltersChange({
      category: "all",
      brand: [],
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      minRating: null,
      sortBy: "relevance"
    })
  }
  
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.category && filters.category !== "all") count++
    if (filters.brand && filters.brand.length > 0) count += filters.brand.length
    if (filters.minPrice !== null || filters.maxPrice !== null) count++
    if (filters.inStockOnly) count++
    if (filters.minRating) count++
    return count
  }
  
  if (loading) {
    return (
      <div className={cn(
        "bg-white rounded-xl shadow-soft p-6 space-y-6",
        className
      )}>
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-soft transition-all duration-300",
      className
    )}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <Badge variant="primary" size="sm">
              {getActiveFilterCount()}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onToggle}
          />
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-primary hover:text-primary/80"
            >
              Clear All
            </Button>
          )}
        </div>
        
        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Categories</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === "all" || !filters.category}
                onChange={() => handleCategoryChange("all")}
                className="mr-3 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map(category => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="mr-3 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700 flex-1">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({category.count})
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Brands */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Brands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brand?.includes(brand) || false}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-3 text-primary focus:ring-primary rounded"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice || ""}
                  onChange={(e) => handlePriceRangeChange(
                    e.target.value ? parseFloat(e.target.value) : null,
                    filters.maxPrice
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="$5000"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handlePriceRangeChange(
                    filters.minPrice,
                    e.target.value ? parseFloat(e.target.value) : null
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            
            {/* Quick Price Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Under $100", min: null, max: 100 },
                { label: "$100-$500", min: 100, max: 500 },
                { label: "$500-$1000", min: 500, max: 1000 },
                { label: "$1000+", min: 1000, max: null }
              ].map(range => (
                <Button
                  key={range.label}
                  variant={
                    filters.minPrice === range.min && filters.maxPrice === range.max
                      ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => handlePriceRangeChange(range.min, range.max)}
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stock Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Availability</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStockOnly || false}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="mr-3 text-primary focus:ring-primary rounded"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>
        
        {/* Rating */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Customer Rating</h4>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map(rating => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="mr-3 text-primary focus:ring-primary"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      size={14}
                      className={
                        i < Math.floor(rating) 
                          ? "text-warning fill-warning" 
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-700">
                    {rating}+ Stars
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar