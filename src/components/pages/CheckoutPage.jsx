import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Price from "@/components/atoms/Price"
import CartItem from "@/components/molecules/CartItem"
import Loading from "@/components/ui/Loading"
import useCart from "@/hooks/useCart"
import orderService from "@/services/api/orderService"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cartItems, clearCart, getCartTotal, getCartCount } = useCart()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState("shipping")
  const [orderTotals, setOrderTotals] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  })
  const [errors, setErrors] = useState({})
  useEffect(() => {
    // Redirect to cart if no items
    if (cartItems.length === 0) {
      navigate("/cart")
      return
    }
    
    // Calculate order totals
    const calculateTotals = async () => {
      try {
        const totals = await orderService.calculateTotals(cartItems)
        setOrderTotals(totals)
      } catch (error) {
        console.error("Error calculating totals:", error)
        toast.error("Error calculating order totals")
      }
    }
    
    calculateTotals()
  }, [cartItems, navigate])
  
  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
}
  
  const handlePaymentInputChange = (field, value) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }
  
  const validateShippingForm = () => {
    const newErrors = {}
    
    if (!customerInfo.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!customerInfo.firstName) {
      newErrors.firstName = "First name is required"
    }
    
    if (!customerInfo.lastName) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!customerInfo.phone) {
      newErrors.phone = "Phone number is required"
    }
    
    if (!customerInfo.address.street) {
      newErrors["address.street"] = "Street address is required"
    }
    
    if (!customerInfo.address.city) {
      newErrors["address.city"] = "City is required"
    }
    
    if (!customerInfo.address.state) {
      newErrors["address.state"] = "State is required"
    }
    
    if (!customerInfo.address.zipCode) {
      newErrors["address.zipCode"] = "ZIP code is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaymentForm = () => {
    const newErrors = {}
    
    if (!paymentInfo.cardNumber) {
      newErrors.cardNumber = "Card number is required"
    } else if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }
    
    if (!paymentInfo.expiryDate) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be MM/YY format"
    }
    
    if (!paymentInfo.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (paymentInfo.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits"
    }
    
    if (!paymentInfo.cardholderName) {
      newErrors.cardholderName = "Cardholder name is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueToPayment = () => {
    if (!validateShippingForm()) {
      toast.error("Please fill in all required shipping information")
      return
    }
    setCurrentStep("payment")
  }

  const handleBackToShipping = () => {
    setCurrentStep("shipping")
  }
  
const handleSubmitOrder = async () => {
    if (!validatePaymentForm()) {
      toast.error("Please fill in all required payment information")
      return
    }
    
    try {
      setLoading(true)
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal: orderTotals.subtotal,
        tax: orderTotals.tax,
        shipping: orderTotals.shipping,
        total: orderTotals.total,
        customerInfo,
        paymentInfo: {
          cardNumber: paymentInfo.cardNumber.replace(/\s/g, '').slice(-4),
          cardholderName: paymentInfo.cardholderName
        }
      }
      
      const order = await orderService.createOrder(orderData)
      
      // Clear cart and redirect to confirmation
      clearCart()
      navigate(`/order-confirmation/${order.Id}`)
      
      toast.success("Order placed successfully!")
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  const handleBackToCart = () => {
    navigate("/cart")
  }
  
  if (cartItems.length === 0) {
    return <Loading />
  }
  
  if (!orderTotals) {
    return <Loading />
  }
  
const itemCount = getCartCount()
  
  const steps = [
    { id: "cart", label: "Cart", icon: "ShoppingCart" },
    { id: "shipping", label: "Shipping", icon: "MapPin" },
    { id: "payment", label: "Payment", icon: "CreditCard" },
    { id: "confirmation", label: "Confirmation", icon: "CheckCircle" }
  ]
  
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
          <ApperIcon name="CreditCard" size={32} className="text-white" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Checkout
        </h1>
        
        <p className="text-gray-600">
          Complete your order of {itemCount} item{itemCount !== 1 ? "s" : ""}
        </p>
        
        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex + 1
              const isCurrent = index === currentStepIndex + 1
              const isUpcoming = index > currentStepIndex + 1
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCompleted ? 'bg-success text-white' : 
                        isCurrent ? 'bg-primary text-white' : 
                        'bg-gray-200 text-gray-400'}
                    `}>
                      <ApperIcon name={step.icon} size={16} />
                    </div>
                    <span className={`
                      mt-2 text-xs font-medium
                      ${isCompleted ? 'text-success' :
                        isCurrent ? 'text-primary' :
                        'text-gray-400'}
                    `}>
                      {step.label}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-4 transition-all duration-300
                      ${isCompleted ? 'bg-success' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
      
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-6"
        >
          {currentStep === "shipping" && (
            <>
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="User" size={20} className="mr-2" />
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={customerInfo.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    error={errors.firstName}
                    placeholder="John"
                  />
                  
                  <Input
                    label="Last Name"
                    value={customerInfo.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    error={errors.lastName}
                    placeholder="Doe"
                  />
                </div>
                
                <Input
                  label="Email Address"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  placeholder="john@example.com"
                  icon="Mail"
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                  placeholder="(555) 123-4567"
                  icon="Phone"
                />
              </div>
              
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="MapPin" size={20} className="mr-2" />
                  Shipping Address
                </h2>
                
                <Input
                  label="Street Address"
                  value={customerInfo.address.street}
                  onChange={(e) => handleInputChange("address.street", e.target.value)}
                  error={errors["address.street"]}
                  placeholder="123 Main St"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={customerInfo.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    error={errors["address.city"]}
                    placeholder="San Francisco"
                  />
                  
                  <Input
                    label="State"
                    value={customerInfo.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                    error={errors["address.state"]}
                    placeholder="CA"
                  />
                </div>
                
                <Input
                  label="ZIP Code"
                  value={customerInfo.address.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                  error={errors["address.zipCode"]}
                  placeholder="94105"
                />
              </div>
              
              {/* Shipping Method */}
              <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="Truck" size={20} className="mr-2" />
                  Delivery Options
                </h2>
                
                <div className="border border-primary bg-primary/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-primary bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Standard Delivery</p>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {orderTotals?.shipping === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          <Price amount={orderTotals?.shipping || 9.99} size="sm" showDiscount={false} />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  icon="ArrowLeft"
                  onClick={handleBackToCart}
                  className="flex-1 shadow-soft hover:shadow-soft-lg"
                >
                  Back to Cart
                </Button>
                
                <Button
                  variant="primary"
                  icon="ArrowRight"
                  onClick={handleContinueToPayment}
                  className="flex-1 shadow-lg hover:shadow-glow"
                >
                  Continue to Payment
                </Button>
              </div>
            </>
          )}
          
          {currentStep === "payment" && (
            <>
              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="CreditCard" size={20} className="mr-2" />
                  Payment Information
                </h2>
                
                <Input
                  label="Cardholder Name"
                  value={paymentInfo.cardholderName}
                  onChange={(e) => handlePaymentInputChange("cardholderName", e.target.value)}
                  error={errors.cardholderName}
                  placeholder="John Doe"
                />
                
                <Input
                  label="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
                    handlePaymentInputChange("cardNumber", value)
                  }}
                  error={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2')
                      handlePaymentInputChange("expiryDate", value)
                    }}
                    error={errors.expiryDate}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  
                  <Input
                    label="CVV"
                    value={paymentInfo.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      handlePaymentInputChange("cvv", value)
                    }}
                    error={errors.cvv}
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
              
              {/* Security Notice */}
              <div className="bg-gradient-to-r from-success/5 to-green-600/5 rounded-xl p-4 border border-success/20">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Shield" size={20} className="text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-success">Secure Payment</p>
                    <p className="text-xs text-success/80 mt-1">
                      Your payment information is encrypted and secure. We never store your credit card details.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  icon="ArrowLeft"
                  onClick={handleBackToShipping}
                  className="flex-1 shadow-soft hover:shadow-soft-lg"
                >
                  Back to Shipping
                </Button>
                
                <Button
                  variant="primary"
                  icon="CheckCircle"
                  onClick={handleSubmitOrder}
                  loading={loading}
                  disabled={loading}
                  className="flex-1 shadow-lg hover:shadow-glow"
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </>
          )}
        </motion.div>
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ApperIcon name="Package" size={20} className="mr-2" />
              Order Summary ({itemCount} items)
            </h2>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  showRemove={false}
                  className="shadow-none border p-3"
                />
              ))}
            </div>
          </div>
          
          {/* Order Totals */}
          <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Order Total
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <Price amount={orderTotals.subtotal} size="sm" showDiscount={false} />
              </div>
              
              <div className="flex justify-between text-gray-600">
                <div className="flex items-center">
                  <span>Shipping</span>
                  {orderTotals.shipping === 0 && (
                    <span className="ml-2 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                <Price amount={orderTotals.shipping} size="sm" showDiscount={false} />
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <Price amount={orderTotals.tax} size="sm" showDiscount={false} />
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">
                    Total
                  </span>
                  <Price amount={orderTotals.total} size="xl" showDiscount={false} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Place Order Button */}
          <Button
            variant="primary"
            size="lg"
            icon="CheckCircle"
            onClick={handleSubmitOrder}
            loading={loading}
            disabled={loading}
            className="w-full shadow-lg hover:shadow-glow"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
          
          {/* Security Info */}
          <div className="bg-gradient-to-r from-success/5 to-green-600/5 rounded-xl p-4 border border-success/20">
            <div className="flex items-center justify-center text-success space-x-2">
              <ApperIcon name="Shield" size={16} />
              <span className="text-sm font-medium">
                Your payment information is secure and encrypted
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage