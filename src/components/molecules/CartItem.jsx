import React from "react"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Price from "@/components/atoms/Price"
import useCart from "@/hooks/useCart"

const CartItem = ({ item, className, showRemove = true, ...props }) => {
  const { updateQuantity, removeFromCart } = useCart()
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.productId)
    } else {
      updateQuantity(item.productId, newQuantity)
    }
  }
  
  const handleRemove = () => {
    removeFromCart(item.productId)
  }
  
  const itemTotal = item.product.price * item.quantity
  
  return (
    <motion.div
      className={cn(
        "flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft border border-gray-100",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 line-clamp-1">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {item.product.brand}
        </p>
        <div className="mt-2">
          <Price amount={item.product.price} size="sm" />
        </div>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 p-0 rounded-full"
        >
          <ApperIcon name="Minus" size={14} />
        </Button>
        
        <span className="w-8 text-center font-medium">
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.product.stockCount}
          className="w-8 h-8 p-0 rounded-full"
        >
          <ApperIcon name="Plus" size={14} />
        </Button>
      </div>
      
      {/* Item Total */}
      <div className="text-right">
        <Price 
          amount={itemTotal} 
          size="md" 
          className="font-bold"
        />
        {item.quantity > 1 && (
          <p className="text-xs text-gray-500 mt-1">
            ${item.product.price.toFixed(2)} each
          </p>
        )}
      </div>
      
      {/* Remove Button */}
      {showRemove && (
        <Button
          variant="ghost"
          size="sm"
          icon="X"
          onClick={handleRemove}
          className="text-gray-400 hover:text-error p-2 rounded-full"
        />
      )}
    </motion.div>
  )
}

export default CartItem