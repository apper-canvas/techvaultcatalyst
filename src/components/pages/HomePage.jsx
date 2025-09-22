import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ProductCard from "@/components/molecules/ProductCard"
import CategoryCard from "@/components/molecules/CategoryCard"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import productService from "@/services/api/productService"

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  useEffect(() => {
    loadHomeData()
  }, [])
  
  const loadHomeData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [featured, categoriesData] = await Promise.all([
        productService.getFeatured(),
        productService.getCategories()
      ])
      
      setFeaturedProducts(featured)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || "Failed to load homepage data")
    } finally {
      setLoading(false)
    }
  }
  
  const retryLoad = () => {
    loadHomeData()
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-3xl overflow-hidden text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-16 lg:py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-6"
            >
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <ApperIcon name="Zap" size={14} className="mr-1" />
                Premium Electronics Store
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Discover the Latest in
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Tech Innovation
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                Explore our curated collection of premium smartphones, laptops, and accessories 
                from the world's leading brands. Experience technology at its finest.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="secondary"
                  size="lg"
                  icon="ShoppingCart"
                  onClick={() => navigate("/category/phones")}
                  className="shadow-xl hover:shadow-2xl backdrop-blur-sm"
                >
                  Shop Now
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  icon="PlayCircle"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
      </motion.section>
      
      {/* Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center space-y-8"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Device
          </h2>
          <p className="text-gray-600 mb-8">
            Search through thousands of premium electronics and find exactly what you need
          </p>
          
          <div className="max-w-md mx-auto">
            <SearchBar 
              placeholder="Search for phones, laptops, accessories..." 
              className="shadow-soft-lg"
            />
          </div>
        </div>
      </motion.section>
      
      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our carefully curated categories to find the latest and greatest in technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Featured Products Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Hand-picked selection of our most popular and highly-rated items
            </p>
          </div>
          
          <Button
            variant="outline"
            icon="ArrowRight"
            onClick={() => navigate("/search")}
            className="hidden sm:flex shadow-soft hover:shadow-soft-lg"
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center sm:hidden">
          <Button
            variant="outline"
            icon="ArrowRight"
            onClick={() => navigate("/search")}
            className="shadow-soft hover:shadow-soft-lg"
          >
            View All Products
          </Button>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gradient-to-br from-gray-50 via-white to-blue-50 rounded-3xl p-8 sm:p-12 lg:p-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose TechVault?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience for premium electronics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "Shield",
              title: "Authentic Products",
              description: "100% genuine products from authorized retailers with full manufacturer warranty"
            },
            {
              icon: "Truck",
              title: "Fast Shipping",
              description: "Free shipping on orders over $100 with express delivery options available"
            },
            {
              icon: "Headphones",
              title: "Expert Support",
              description: "Dedicated customer support from tech experts available 24/7"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + (0.1 * index), duration: 0.6 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-xl flex items-center justify-center mx-auto">
                <ApperIcon name={feature.icon} size={32} className="text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage