import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Price from "@/components/atoms/Price"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import orderService from "@/services/api/orderService"

const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    if (orderId) {
      loadOrder()
    }
  }, [orderId])
  
  const loadOrder = async () => {
    try {
      setLoading(true)
      setError("")
      
      const orderData = await orderService.getById(orderId)
      setOrder(orderData)
    } catch (err) {
      setError(err.message || "Order not found")
    } finally {
      setLoading(false)
    }
  }
  
  const retryLoad = () => {
    loadOrder()
  }
  
  const handleContinueShopping = () => {
    navigate("/")
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "warning"
      case "shipped":
        return "info"
      case "delivered":
        return "success"
      case "cancelled":
        return "error"
      default:
        return "secondary"
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return "Clock"
      case "shipped":
        return "Truck"
      case "delivered":
        return "CheckCircle"
      case "cancelled":
        return "XCircle"
      default:
        return "Package"
    }
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }
  
  if (!order) {
    return <Error title="Order Not Found" message="The order you're looking for doesn't exist." />
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-success via-green-500 to-emerald-600 rounded-3xl text-white p-8 sm:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm"
          >
            <ApperIcon name="CheckCircle" size={40} className="text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-bold">
              Order Confirmed!
            </h1>
            
            <p className="text-xl text-green-100">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <div className="space-y-2">
                <p className="text-green-200 text-sm">Order Number</p>
                <p className="text-2xl font-bold font-mono">#{order.Id.toString().padStart(6, "0")}</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </motion.div>
      
      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Package" size={20} className="mr-2" />
              Order Status
            </h2>
            
            <div className="flex items-center gap-3">
              <Badge variant={getStatusColor(order.status)} size="lg" className="font-semibold">
                <ApperIcon name={getStatusIcon(order.status)} size={14} className="mr-1" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              
              <span className="text-sm text-gray-500">
                {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            
            {order.status === "processing" && (
              <div className="bg-gradient-to-r from-warning/10 to-amber-500/10 rounded-lg p-4 border border-warning/20">
                <p className="text-sm text-warning">
                  <ApperIcon name="Clock" size={14} className="inline mr-1" />
                  Your order is being processed and will be shipped within 1-2 business days.
                </p>
              </div>
            )}
          </div>
          
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="User" size={20} className="mr-2" />
              Customer Information
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{order.customerInfo.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{order.customerInfo.phone}</p>
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="MapPin" size={20} className="mr-2" />
              Shipping Address
            </h2>
            
            <div className="text-gray-700">
              <p>{order.customerInfo.address.street}</p>
              <p>
                {order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.zipCode}
              </p>
            </div>
            
{order.estimatedDelivery && (
              <div className="bg-gradient-to-r from-info/10 to-blue-600/10 rounded-lg p-4 border border-info/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-info">
                    <ApperIcon name="Truck" size={14} className="inline mr-1" />
                    Estimated delivery: {format(new Date(order.estimatedDelivery), "EEEE, MMM d")}
                  </p>
                  {order.shippingMethod && (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {order.shippingMethod.name}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
              Order Items ({order.items.length})
            </h2>
            
<div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={20} className="text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Product #{item.productId}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Unit Price: ${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-right">
                    <Price amount={item.price * item.quantity} size="sm" showDiscount={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
{/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="CreditCard" size={20} className="mr-2" />
              Payment Summary
            </h2>
            
            {/* Payment Method Info */}
            {order.paymentMethod && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon 
                      name={order.paymentMethod === 'credit-card' || order.paymentMethod === 'debit-card' ? 'CreditCard' : 
                           order.paymentMethod === 'paypal' ? 'Wallet' : 'Smartphone'} 
                      size={20} 
                      className="text-primary" 
                    />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {order.paymentMethod.replace('-', ' ')} Payment
                      </p>
                      {order.paymentInfo?.cardNumber && (
                        <p className="text-sm text-gray-500">**** **** **** {order.paymentInfo.cardNumber}</p>
                      )}
                      {order.paymentInfo?.email && (
                        <p className="text-sm text-gray-500">{order.paymentInfo.email}</p>
                      )}
                      {order.paymentInfo?.upiId && (
                        <p className="text-sm text-gray-500">{order.paymentInfo.upiId}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">Paid</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <Price amount={order.subtotal} size="sm" showDiscount={false} />
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <Price amount={order.shipping} size="sm" showDiscount={false} />
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <Price amount={order.tax} size="sm" showDiscount={false} />
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">
                    Total Paid
                  </span>
                  <Price amount={order.total} size="lg" showDiscount={false} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              icon="Home"
              onClick={handleContinueShopping}
              className="w-full shadow-lg hover:shadow-glow"
            >
              Continue Shopping
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              icon="Download"
              className="w-full shadow-soft hover:shadow-soft-lg"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-center"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">
            What's Next?
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            You'll receive an email confirmation shortly with your order details and tracking information. 
            We'll notify you when your order ships and provide updates on its delivery status.
          </p>
          
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-6 pt-4">
            <div className="flex items-center">
              <ApperIcon name="Mail" size={16} className="mr-2" />
              <span>Email updates</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Truck" size={16} className="mr-2" />
              <span>Order tracking</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Headphones" size={16} className="mr-2" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderConfirmationPage