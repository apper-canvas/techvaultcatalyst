import React from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const CategoryCard = ({ category, className, ...props }) => {
  const navigate = useNavigate()
  
  const handleCategoryClick = () => {
    navigate(`/category/${category.id}`)
  }
  
  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
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
  
  const getCategoryGradient = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "phones":
        return "from-blue-500 to-purple-600"
      case "laptops":
        return "from-green-500 to-teal-600"
      case "accessories":
        return "from-orange-500 to-red-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }
  
  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300",
        className
      )}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCategoryClick}
      {...props}
    >
      <div className={cn(
        "bg-gradient-to-br p-8 text-white relative",
        getCategoryGradient(category.name)
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] bg-repeat"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <ApperIcon 
              name={getCategoryIcon(category.name)} 
              size={48}
              className="text-white/80 group-hover:text-white transition-colors duration-300" 
            />
            <div className="text-right">
              <div className="text-2xl font-bold">{category.count}</div>
              <div className="text-sm text-white/80">Products</div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
            {category.name}
          </h3>
          
          <div className="flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
            <span className="text-sm mr-2">Explore Collection</span>
            <ApperIcon 
              name="ArrowRight" 
              size={16}
              className="transform group-hover:translate-x-1 transition-transform duration-300" 
            />
          </div>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
      </div>
    </motion.div>
  )
}

export default CategoryCard