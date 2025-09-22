import ordersData from "@/services/mockData/orders.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let orders = [...ordersData]

const orderService = {
  async createOrder(orderData) {
    await delay(500)
    
    const newOrder = {
      Id: Math.max(...orders.map(o => o.Id), 0) + 1,
      ...orderData,
status: "processing",
      createdAt: new Date().toISOString(),
      estimatedDelivery: calculateEstimatedDelivery(orderData.shippingMethod?.type || 'standard')
    }
    
    orders.push(newOrder)
    return { ...newOrder }
  },

  async getById(id) {
    await delay(300)
    const order = orders.find(o => o.Id === parseInt(id))
    if (!order) {
      throw new Error("Order not found")
    }
    return { ...order }
  },

  async updateStatus(id, status) {
    await delay(400)
    const orderIndex = orders.findIndex(o => o.Id === parseInt(id))
    if (orderIndex === -1) {
      throw new Error("Order not found")
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    }
    
    return { ...orders[orderIndex] }
  },

async calculateTotals(cartItems, shippingType = 'standard') {
    await delay(200)
    
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    // Calculate shipping based on method and free shipping threshold
    let shipping = 0
    if (subtotal < 100 || shippingType !== 'standard') {
      switch (shippingType) {
        case 'express':
          shipping = 19.99
          break
        case 'nextday':
          shipping = 29.99
          break
        default: // standard
          shipping = subtotal >= 100 ? 0 : 9.99
          break
      }
    }
    
    // 8.5% tax rate
    const tax = subtotal * 0.085
    
    const total = subtotal + shipping + tax
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    }
  },

}

// Helper function to calculate estimated delivery date
function calculateEstimatedDelivery(shippingType) {
  const now = Date.now()
  let days = 7 // default standard shipping
  
  switch (shippingType) {
    case 'nextday':
      days = 1
      break
    case 'express':
      days = 3
      break
    default: // standard
      days = 7
      break
  }
  
  return new Date(now + days * 24 * 60 * 60 * 1000).toISOString()
}

export default orderService