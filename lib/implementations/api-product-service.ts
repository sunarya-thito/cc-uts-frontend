import type { Product, ProductInput, ProductUpdateInput } from "../types"
import type { ProductService } from "../interfaces/product-service"

export class ApiProductService implements ProductService {
  private readonly apiUrl: string

  constructor() {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
      console.warn("NEXT_PUBLIC_API_URL is not defined. API requests will fail.")
    }

    this.apiUrl = apiUrl || ""
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `API error: ${response.status} ${response.statusText}${errorData.message ? ` - ${errorData.message}` : ""}`,
      )
    }

    return response.json()
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.apiUrl}/products`)
      return this.handleResponse<Product[]>(response)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      throw new Error("Failed to fetch products. Please try again later.")
    }
  }

  // Get a single product by ID
  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.apiUrl}/products/${id}`)

      if (response.status === 404) {
        return null
      }

      return this.handleResponse<Product>(response)
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error)
      throw new Error("Failed to fetch product. Please try again later.")
    }
  }

  // Create a new product
  async createProduct(input: ProductInput): Promise<Product> {
    try {
      // If the image is a data URL (from the file input), we need to convert it to a file
      const formData = new FormData()

      // Add the product data
      formData.append("name", input.name)
      formData.append("price", input.price.toString())

      // Handle the image - could be a data URL or a URL string
      if (input.image.startsWith("data:")) {
        // Convert data URL to file
        const file = this.dataURLtoFile(input.image, "product-image.jpg")
        formData.append("image", file)
      } else {
        // It's already a URL, just pass it along
        formData.append("imageUrl", input.image)
      }

      const response = await fetch(`${this.apiUrl}/products`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header when using FormData
        // The browser will set it automatically with the correct boundary
      })

      return this.handleResponse<Product>(response)
    } catch (error) {
      console.error("Failed to create product:", error)
      throw new Error("Failed to create product. Please try again later.")
    }
  }

  // Update an existing product
  async updateProduct(id: string, input: ProductUpdateInput): Promise<Product | null> {
    try {
      // Similar to createProduct, we use FormData for file uploads
      const formData = new FormData()

      // Add the product data
      formData.append("name", input.name)
      formData.append("price", input.price.toString())

      // Handle the image - could be a data URL or a URL string
      if (input.image) {
        if (input.image.startsWith("data:")) {
          // Convert data URL to file
          const file = this.dataURLtoFile(input.image, "product-image.jpg")
          formData.append("image", file)
        } else {
          // It's already a URL, just pass it along
          formData.append("imageUrl", input.image)
        }
      }

      const response = await fetch(`${this.apiUrl}/products/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (response.status === 404) {
        return null
      }

      return this.handleResponse<Product>(response)
    } catch (error) {
      console.error(`Failed to update product with ID ${id}:`, error)
      throw new Error("Failed to update product. Please try again later.")
    }
  }

  // Delete a product
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/products/${id}`, {
        method: "DELETE",
      })

      if (response.status === 404) {
        return false
      }

      // Some APIs return 204 No Content for successful deletion
      if (response.status === 204) {
        return true
      }

      await this.handleResponse<{ success: boolean }>(response)
      return true
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error)
      throw new Error("Failed to delete product. Please try again later.")
    }
  }

  // Helper method to convert a data URL to a File object
  private dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",")
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }
}
