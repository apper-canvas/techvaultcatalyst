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
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
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

  async calculateTotals(cartItems) {
    await delay(200)
    
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    // Free shipping over $100, otherwise $9.99
    const shipping = subtotal >= 100 ? 0 : 9.99
    
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

  async calculateTotals(items) {
    await delay(100)
    
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 100 ? 0 : 15.99 // Free shipping over $100
    const total = subtotal + tax + shipping
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100
    }
  }
}

export default orderService