import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Price from "@/components/atoms/Price"
import Rating from "@/components/atoms/Rating"
import ProductCard from "@/components/molecules/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import useCart from "@/hooks/useCart"
import productService from "@/services/api/productService"

const ProductPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToCart, isInCart, getCartItem } = useCart()
  
  useEffect(() => {
    if (productId) {
      loadProductData()
    }
  }, [productId])
  
  const loadProductData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const productData = await productService.getById(productId)
      setProduct(productData)
      
      // Load related products
      const related = await productService.getRelated(productId, productData.category)
      setRelatedProducts(related)
    } catch (err) {
      setError(err.message || "Product not found")
    } finally {
      setLoading(false)
    }
  }
  
  const retryLoad = () => {
    loadProductData()
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success(`${quantity} x ${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
    })
  }
  
const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate("/checkout")
  }
  
  const handleImageChange = (index) => {
    setCurrentImageIndex(index)
  }
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }
  
  if (!product) {
    return <Error title="Product Not Found" message="The product you're looking for doesn't exist." />
  }
  
  const cartItem = getCartItem(product.Id)
  const images = product.images && product.images.length > 0 ? product.images : [product.image]
  
  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-500"
      >
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Home
        </button>
        <ApperIcon name="ChevronRight" size={14} />
        <button 
          onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
          className="hover:text-primary"
        >
          {product.category}
        </button>
        <ApperIcon name="ChevronRight" size={14} />
        <span className="text-gray-900">{product.name}</span>
      </motion.nav>
      
      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Main Image */}
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-soft">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index
                      ? "border-primary shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Product Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Product Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="primary" size="sm">
                {product.brand}
              </Badge>
              {product.featured && (
                <Badge variant="warning" size="sm">
                  Featured
                </Badge>
              )}
              {product.discount > 0 && (
                <Badge variant="error" size="sm">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            <Rating 
              rating={product.rating} 
              size="md" 
              reviewCount={product.reviewCount}
            />
          </div>
          
          {/* Price */}
          <div className="border-y border-gray-200 py-6">
            <Price 
              amount={product.price}
              originalAmount={product.originalPrice}
              discount={product.discount}
              size="xl"
            />
            
            {/* Stock Status */}
            <div className="mt-4">
              {product.inStock ? (
                <div className="flex items-center text-success">
                  <ApperIcon name="Check" size={20} className="mr-2" />
                  <span className="font-medium">In Stock ({product.stockCount} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-error">
                  <ApperIcon name="X" size={20} className="mr-2" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quantity & Actions */}
          {product.inStock && (
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 p-0 rounded-full"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </Button>
                  
                  <span className="w-12 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stockCount}
                    className="w-10 h-10 p-0 rounded-full"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon="ShoppingCart"
                  onClick={handleAddToCart}
                  className="flex-1 shadow-lg hover:shadow-glow"
                >
                  {cartItem ? `Add More (${cartItem.quantity} in cart)` : "Add to Cart"}
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1 shadow-lg"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          )}
          
          {/* Product Description */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Specifications */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white rounded-xl shadow-soft p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Technical Specifications
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(product.specifications || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-900 flex-shrink-0 mr-4">
                {key}
              </span>
              <span className="text-gray-700 text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      </motion.section>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Related Products
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard 
                key={relatedProduct.Id} 
                product={relatedProduct}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}

export default ProductPage