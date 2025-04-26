import type { Product, ProductInput, ProductUpdateInput } from "../types"
import type { ProductService } from "../interfaces/product-service"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class LocalStorageProductService implements ProductService {
  private readonly storageKey = "products"

  private getStoredProducts(): Product[] {
    if (typeof window === "undefined") return []

    const storedProducts = localStorage.getItem(this.storageKey)
    return storedProducts ? JSON.parse(storedProducts) : []
  }

  private setStoredProducts(products: Product[]): void {
    if (typeof window === "undefined") return

    localStorage.setItem(this.storageKey, JSON.stringify(products))
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    await delay(300) // Simulate small delay
    return this.getStoredProducts()
  }

  // Get a single product by ID
  async getProduct(id: string): Promise<Product | null> {
    await delay(200) // Simulate small delay
    const products = this.getStoredProducts()
    const product = products.find((p) => p.id === id)
    return product || null
  }

  // Create a new product
  async createProduct(input: ProductInput): Promise<Product> {
    await delay(500) // Simulate small delay

    const products = this.getStoredProducts()
    const newProduct: Product = {
      id: Date.now().toString(),
      ...input,
      dateAdded: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    }

    this.setStoredProducts([...products, newProduct])
    return newProduct
  }

  // Update an existing product
  async updateProduct(id: string, input: ProductUpdateInput): Promise<Product | null> {
    await delay(500) // Simulate small delay

    const products = this.getStoredProducts()
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

    const updatedProducts = [...products.slice(0, index), updatedProduct, ...products.slice(index + 1)]

    this.setStoredProducts(updatedProducts)
    return updatedProduct
  }

  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    await delay(400) // Simulate small delay

    const products = this.getStoredProducts()
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false

    const updatedProducts = [...products.slice(0, index), ...products.slice(index + 1)]
    this.setStoredProducts(updatedProducts)

    return true
  }
}
