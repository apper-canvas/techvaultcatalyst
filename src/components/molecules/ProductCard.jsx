import React from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Price from "@/components/atoms/Price"
import Rating from "@/components/atoms/Rating"
import useCart from "@/hooks/useCart"
import { toast } from "react-toastify"

const ProductCard = ({ product, className, ...props }) => {
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart()
  
  const handleProductClick = () => {
    navigate(`/product/${product.Id}`)
  }
  
  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }
  
  const handleQuickView = (e) => {
    e.stopPropagation()
    navigate(`/product/${product.Id}`)
  }
  
  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100",
        className
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleProductClick}
      {...props}
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="warning" size="sm" className="font-bold">
            {product.discount}% OFF
          </Badge>
        </div>
      )}
      
      {/* Stock Status */}
      {!product.inStock && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="error" size="sm">
            Out of Stock
          </Badge>
        </div>
      )}
      
      {/* Featured Badge */}
      {product.featured && product.inStock && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="primary" size="sm" className="font-bold">
            Featured
          </Badge>
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon="Eye"
              onClick={handleQuickView}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              Quick View
            </Button>
            
            {product.inStock && (
              <Button
                variant="primary"
                size="sm"
                icon={isInCart(product.Id) ? "Check" : "ShoppingCart"}
                onClick={handleAddToCart}
                className="shadow-lg"
              >
                {isInCart(product.Id) ? "Added" : "Add to Cart"}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          {product.brand}
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Rating */}
        <Rating 
          rating={product.rating} 
          size="xs" 
          reviewCount={product.reviewCount}
        />
        
        {/* Price */}
        <Price 
          amount={product.price}
          originalAmount={product.originalPrice}
          discount={product.discount}
          size="md"
          className="mt-2"
        />
        
        {/* Stock Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {product.inStock ? (
            <span className="flex items-center text-success">
              <ApperIcon name="Check" size={12} className="mr-1" />
              In Stock ({product.stockCount} left)
            </span>
          ) : (
            <span className="flex items-center text-error">
              <ApperIcon name="X" size={12} className="mr-1" />
              Out of Stock
            </span>
          )}
        </div>
      </div>
      
      {/* Bottom Action */}
      <div className="p-4 pt-0">
        {product.inStock ? (
          <Button
            variant="outline"
            size="sm"
            icon="ShoppingCart"
            onClick={handleAddToCart}
            className="w-full"
          >
            Add to Cart
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="w-full"
          >
            Notify When Available
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard