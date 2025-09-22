import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import SearchBar from "@/components/molecules/SearchBar"
import useCart from "@/hooks/useCart"

const Header = ({ className, ...props }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { getCartCount } = useCart()
  
  const cartCount = getCartCount()
  
  const navigationItems = [
    { label: "Home", path: "/", icon: "Home" },
    { label: "Phones", path: "/category/phones", icon: "Smartphone" },
    { label: "Laptops", path: "/category/laptops", icon: "Laptop" },
    { label: "Accessories", path: "/category/accessories", icon: "Headphones" }
  ]
  
  const isActivePath = (path) => {
    return location.pathname === path || 
           (path.includes("/category/") && location.pathname.startsWith(path))
  }
  
  const handleCartClick = () => {
    navigate("/cart")
  }
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  return (
    <header className={cn(
      "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm",
      className
    )} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">TechVault</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Premium Electronics</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  isActivePath(item.path)
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-gray-700 hover:text-primary hover:bg-primary/5"
                )}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              icon="Search"
              onClick={() => navigate("/search")}
              className="lg:hidden"
            />
            
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="relative"
            >
              <ApperIcon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <Badge 
                  variant="primary" 
                  size="sm"
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full text-xs font-bold animate-bounce-gentle"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={isMobileMenuOpen ? "X" : "Menu"}
              onClick={toggleMobileMenu}
              className="lg:hidden"
            />
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <SearchBar />
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                    isActivePath(item.path)
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-gray-700 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Cart Link */}
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name="ShoppingCart" size={20} />
                  <span>Shopping Cart</span>
                </div>
                {cartCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header