import productsData from "@/services/mockData/products.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const productService = {
  async getAll() {
    await delay(300)
    return [...productsData]
  },

  async getById(id) {
    await delay(200)
    const product = productsData.find(p => p.Id === parseInt(id))
    if (!product) {
      throw new Error("Product not found")
    }
    return { ...product }
  },

  async getByCategory(category) {
    await delay(350)
    return productsData.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    ).map(p => ({ ...p }))
  },

  async searchProducts(query) {
    await delay(400)
    const searchTerm = query.toLowerCase()
    return productsData.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }))
  },

  async getFeatured() {
    await delay(250)
    // Return products with high ratings or marked as featured
    return productsData.filter(p => p.rating >= 4.5 || p.featured)
      .slice(0, 8)
      .map(p => ({ ...p }))
  },

  async getRelated(productId, category) {
    await delay(300)
    return productsData.filter(p => 
      p.Id !== parseInt(productId) && 
      p.category.toLowerCase() === category.toLowerCase()
    ).slice(0, 4).map(p => ({ ...p }))
  },

  async filterProducts(filters) {
    await delay(350)
    let filtered = [...productsData]

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      )
    }

    if (filters.brand && filters.brand.length > 0) {
      filtered = filtered.filter(p => 
        filters.brand.includes(p.brand)
      )
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= filters.minPrice)
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice)
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.inStock)
    }

    if (filters.minRating) {
      filtered = filtered.filter(p => p.rating >= filters.minRating)
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_low":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price_high":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          break
        default:
          break
      }
    }

    return filtered.map(p => ({ ...p }))
  },

  async getCategories() {
    await delay(200)
    const categories = [...new Set(productsData.map(p => p.category))]
    return categories.map(category => ({
      id: category.toLowerCase(),
      name: category,
      count: productsData.filter(p => p.category === category).length
    }))
  },

  async getBrands() {
    await delay(200)
    const brands = [...new Set(productsData.map(p => p.brand))]
    return brands.sort()
  }
}

export default productService