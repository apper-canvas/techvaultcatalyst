import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import ProductGrid from "@/components/organisms/ProductGrid"
import FilterSidebar from "@/components/molecules/FilterSidebar"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import productService from "@/services/api/productService"

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    category: "all",
    brand: [],
    minPrice: null,
    maxPrice: null,
    inStockOnly: false,
    minRating: null,
    sortBy: "relevance"
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  
  useEffect(() => {
    // Get search query from URL params
    const params = new URLSearchParams(location.search)
    const query = params.get("q") || ""
    setSearchQuery(query)
    
    if (query) {
      performSearch(query)
      addToSearchHistory(query)
    } else {
      loadAllProducts()
    }
  }, [location.search])
  
  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem("search_history") || "[]")
    setSearchHistory(history)
  }, [])
  
  const performSearch = async (query) => {
    try {
      setLoading(true)
      setError("")
      
      const data = await productService.searchProducts(query)
      setProducts(data)
    } catch (err) {
      setError(err.message || "Search failed")
    } finally {
      setLoading(false)
    }
  }
  
  const loadAllProducts = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }
  
  const addToSearchHistory = (query) => {
    if (!query.trim()) return
    
    const history = JSON.parse(localStorage.getItem("search_history") || "[]")
    const updatedHistory = [query, ...history.filter(item => item !== query)].slice(0, 5)
    
    localStorage.setItem("search_history", JSON.stringify(updatedHistory))
    setSearchHistory(updatedHistory)
  }
  
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }
  
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen)
  }
  
  const clearSearch = () => {
    setSearchQuery("")
    navigate("/search")
  }
  
  const retryLoad = () => {
    if (searchQuery) {
      performSearch(searchQuery)
    } else {
      loadAllProducts()
    }
  }
  
  const getResultsTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    }
    return "All Products"
  }
  
  const getResultsDescription = () => {
    if (searchQuery) {
      return `Found ${products.length} product${products.length !== 1 ? "s" : ""} matching your search`
    }
    return "Browse our complete collection of premium electronics"
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }
  
  return (
    <div className="space-y-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12 shadow-soft"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ApperIcon name="Search" size={32} className="text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {getResultsTitle()}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              {getResultsDescription()}
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              className="shadow-soft-lg"
              placeholder="Search for phones, laptops, accessories..."
            />
          </div>
          
          {/* Current Search & Clear */}
          {searchQuery && (
            <div className="flex items-center justify-center gap-4">
              <Badge variant="primary" size="lg" className="font-medium">
                <ApperIcon name="Search" size={14} className="mr-1" />
                {searchQuery}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={clearSearch}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear
              </Button>
            </div>
          )}
          
          {/* Search History */}
          {!searchQuery && searchHistory.length > 0 && (
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Searches</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {searchHistory.map((historyQuery, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(historyQuery)}
                    className="text-xs"
                  >
                    {historyQuery}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Results Section */}
      {products.length === 0 && !loading ? (
        <Empty 
          title={searchQuery ? "No Results Found" : "No Products Available"}
          description={searchQuery ? `No products match "${searchQuery}". Try different keywords or browse categories.` : "No products are currently available."}
          actionLabel="Browse Categories"
          onAction={() => navigate("/")}
          icon="Search"
        />
      ) : (
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
                initialProducts={products}
                filters={filters}
                searchQuery={searchQuery}
                showFilters={true}
              />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage