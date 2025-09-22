import React, { useState, useEffect } from "react"
import { cn } from "@/utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "@/components/molecules/ProductCard"
import SortDropdown from "@/components/molecules/SortDropdown"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import productService from "@/services/api/productService"

const ProductGrid = ({ 
  initialProducts,
  filters = {},
  searchQuery,
  category,
  className,
  showFilters = true,
  ...props 
}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState("grid")
  
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts)
    } else {
      loadProducts()
    }
  }, [initialProducts, filters, searchQuery, category, sortBy])
  
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      
      let data = []
      
      if (searchQuery) {
        data = await productService.searchProducts(searchQuery)
      } else if (category) {
        data = await productService.getByCategory(category)
      } else {
        data = await productService.getAll()
      }
      
      // Apply filters
      if (Object.keys(filters).length > 0) {
        const filtersWithSort = { ...filters, sortBy }
        data = await productService.filterProducts(filtersWithSort)
      } else if (sortBy !== "relevance") {
        // Apply sorting if no filters but sort is specified
        data = await productService.filterProducts({ sortBy })
      }
      
      setProducts(data)
    } catch (err) {
      setError(err.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }
  
  const retryLoad = () => {
    loadProducts()
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }
  
  if (products.length === 0) {
    const emptyMessage = searchQuery 
      ? `No products found for "${searchQuery}"`
      : category 
        ? `No products found in ${category}`
        : "No products available"
    
    return (
      <Empty 
        title={emptyMessage}
        description="Try adjusting your search or filters"
        actionLabel="Browse All Products"
        onAction={() => window.location.href = "/"}
      />
    )
  }
  
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Toolbar */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-soft">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </span>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                icon="Grid3x3"
                onClick={() => setViewMode("grid")}
                className="px-3 py-1.5"
              />
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                icon="List"
                onClick={() => setViewMode("list")}
                className="px-3 py-1.5"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SortDropdown 
              value={sortBy}
              onChange={setSortBy}
              className="w-full sm:w-auto min-w-[200px]"
            />
          </div>
        </div>
      )}
      
      {/* Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${products.length}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          )}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <ProductCard 
                product={product}
                className={cn(
                  viewMode === "list" && "flex-row max-w-none"
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Load More Button - if we implement pagination */}
      {products.length > 0 && products.length % 12 === 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            icon="Plus"
            className="shadow-soft hover:shadow-soft-lg"
          >
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid