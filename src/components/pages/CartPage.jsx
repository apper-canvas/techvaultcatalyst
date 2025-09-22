import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Price from "@/components/atoms/Price"
import CartItem from "@/components/molecules/CartItem"
import ProductCard from "@/components/molecules/ProductCard"
import Empty from "@/components/ui/Empty"
import useCart from "@/hooks/useCart"

const CartPage = () => {
  const navigate = useNavigate()
  const { cartItems, clearCart, getCartTotal, getCartCount } = useCart()
  const [isClearing, setIsClearing] = useState(false)
  
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsClearing(true)
      setTimeout(() => {
        clearCart()
        setIsClearing(false)
        toast.info("Cart cleared successfully")
      }, 300)
    }
  }
  
  const handleCheckout = () => {
    navigate("/checkout")
  }
  
  const handleContinueShopping = () => {
    navigate("/")
  }
  
  const cartTotal = getCartTotal()
  const itemCount = getCartCount()
  const shipping = cartTotal > 100 ? 0 : 15.99
  const tax = cartTotal * 0.08
  const finalTotal = cartTotal + shipping + tax
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Empty 
          title="Your cart is empty"
          description="Add some amazing products to get started with your tech journey."
          actionLabel="Shop Now"
          onAction={handleContinueShopping}
          icon="ShoppingCart"
        />
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
          <ApperIcon name="ShoppingCart" size={32} className="text-white" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Shopping Cart
        </h1>
        
        <p className="text-gray-600">
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Header */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Cart Items ({itemCount})
            </h2>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-error hover:text-error hover:bg-error/5"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </Button>
          </div>
          
          {/* Cart Items List */}
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                />
              ))}
            </div>
          </AnimatePresence>
          
          {/* Continue Shopping */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-gray-900">
                Need something else?
              </h3>
              <p className="text-gray-600 text-sm">
                Browse our complete collection of premium electronics
              </p>
              <Button
                variant="outline"
                icon="ArrowLeft"
                onClick={handleContinueShopping}
                className="shadow-soft hover:shadow-soft-lg"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-xl shadow-soft p-6 space-y-6 sticky top-24"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>
            
            {/* Summary Details */}
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <Price amount={cartTotal} size="sm" showDiscount={false} />
              </div>
              
              <div className="flex justify-between text-gray-600">
                <div className="flex items-center">
                  <span>Shipping</span>
                  {cartTotal > 100 && (
                    <span className="ml-2 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                <Price amount={shipping} size="sm" showDiscount={false} />
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <Price amount={tax} size="sm" showDiscount={false} />
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <Price amount={finalTotal} size="lg" showDiscount={false} />
                </div>
              </div>
            </div>
            
            {/* Free Shipping Info */}
            {cartTotal <= 100 && (
              <div className="bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-lg p-4 border border-accent/20">
                <div className="flex items-center text-accent">
                  <ApperIcon name="Truck" size={16} className="mr-2" />
                  <span className="text-sm font-medium">
                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                  </span>
                </div>
              </div>
            )}
            
            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              icon="CreditCard"
              onClick={handleCheckout}
              className="w-full shadow-lg hover:shadow-glow"
            >
              Proceed to Checkout
            </Button>
            
            {/* Security Info */}
            <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
              <ApperIcon name="Shield" size={16} />
              <span>Secure checkout guaranteed</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CartPage