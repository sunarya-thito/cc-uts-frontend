import type { Product, ProductInput, ProductUpdateInput } from "../types"
import type { ProductService } from "../interfaces/product-service"

// In-memory storage for products
let products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    dateAdded: new Date("2023-01-15").toISOString(),
    dateUpdated: new Date("2023-01-15").toISOString(),
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    dateAdded: new Date("2023-02-20").toISOString(),
    dateUpdated: new Date("2023-03-10").toISOString(),
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    dateAdded: new Date("2023-03-05").toISOString(),
    dateUpdated: new Date("2023-03-05").toISOString(),
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80",
    dateAdded: new Date("2023-04-12").toISOString(),
    dateUpdated: new Date("2023-04-12").toISOString(),
  },
]

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class DummyProductService implements ProductService {
  // Get all products
  async getProducts(): Promise<Product[]> {
    await delay(1000) // Simulate network delay
    return [...products]
  }

  // Get a single product by ID
  async getProduct(id: string): Promise<Product | null> {
    await delay(800) // Simulate network delay
    const product = products.find((p) => p.id === id)
    return product || null
  }

  // Create a new product
  async createProduct(input: ProductInput): Promise<Product> {
    await delay(1200) // Simulate network delay

    const newProduct: Product = {
      id: Date.now().toString(),
      ...input,
      dateAdded: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    }

    products = [...products, newProduct]
    return newProduct
  }

  // Update an existing product
  async updateProduct(id: string, input: ProductUpdateInput): Promise<Product | null> {
    await delay(1200) // Simulate network delay

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null

    const existingProduct = products[index]

    const updatedProduct: Product = {
      // Keep the existing values for unchanged fields
      id: existingProduct.id,
      name: input.name || existingProduct.name,
      price: input.price || existingProduct.price,
      image: input.image || existingProduct.image,
      dateAdded: existingProduct.dateAdded,
      dateUpdated: new Date().toISOString(),
    }

    products = [...products.slice(0, index), updatedProduct, ...products.slice(index + 1)]

    return updatedProduct
  }

  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    await delay(800) // Simulate network delay

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false

    products = [...products.slice(0, index), ...products.slice(index + 1)]

    return true
  }
}
