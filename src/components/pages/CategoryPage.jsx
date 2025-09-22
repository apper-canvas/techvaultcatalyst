import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ProductGrid from "@/components/organisms/ProductGrid"
import FilterSidebar from "@/components/molecules/FilterSidebar"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import productService from "@/services/api/productService"

const CategoryPage = () => {
  const { categoryId } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    category: categoryId,
    brand: [],
    minPrice: null,
    maxPrice: null,
    inStockOnly: false,
    minRating: null,
    sortBy: "relevance"
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  useEffect(() => {
    loadCategoryProducts()
  }, [categoryId])
  
  const loadCategoryProducts = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await productService.getByCategory(categoryId)
      setProducts(data)
      
      // Update filters to match current category
      setFilters(prev => ({
        ...prev,
        category: categoryId
      }))
    } catch (err) {
      setError(err.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }
  
  const retryLoad = () => {
    loadCategoryProducts()
  }
  
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen)
  }
  
  const getCategoryDisplayName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }
  
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "phones":
        return "Smartphone"
      case "laptops":
        return "Laptop"
      case "accessories":
        return "Headphones"
      default:
        return "Package"
    }
  }
  
  const getCategoryDescription = (category) => {
    switch (category.toLowerCase()) {
      case "phones":
        return "Discover the latest smartphones with cutting-edge technology, premium design, and powerful performance."
      case "laptops":
        return "Explore high-performance laptops perfect for work, gaming, and creative projects."
      case "accessories":
        return "Complete your tech setup with premium accessories, headphones, and essential gadgets."
      default:
        return "Browse our complete collection of premium electronics."
    }
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }
  
  if (products.length === 0) {
    return (
      <Empty 
        title={`No ${getCategoryDisplayName(categoryId)} Found`}
        description="We don't have any products in this category yet. Check back soon or browse other categories."
        actionLabel="Browse All Products"
        onAction={() => window.location.href = "/"}
        icon={getCategoryIcon(categoryId)}
      />
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Category Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12 shadow-soft"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <ApperIcon 
              name={getCategoryIcon(categoryId)} 
              size={40} 
              className="text-white" 
            />
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-4">
              <Badge variant="primary" size="lg" className="font-semibold">
                {getCategoryDisplayName(categoryId)}
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {getCategoryDisplayName(categoryId)} Collection
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {getCategoryDescription(categoryId)}
            </p>
          </div>
          
          <div className="flex items-center justify-center text-sm text-gray-500">
            <ApperIcon name="Package" size={16} className="mr-2" />
            {products.length} product{products.length !== 1 ? "s" : ""} available
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            icon="Filter"
            onClick={toggleFilters}
            className="w-full shadow-soft hover:shadow-soft-lg"
          >
            Filters & Sort
          </Button>
        </div>
        
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
        
        {/* Filter Sidebar - Mobile Overlay */}
        {isFilterOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={toggleFilters}
            />
            <div className="lg:hidden fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={isFilterOpen}
                onToggle={toggleFilters}
              />
            </div>
          </>
        )}
        
        {/* Product Grid */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ProductGrid
              filters={filters}
              category={categoryId}
              showFilters={true}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage