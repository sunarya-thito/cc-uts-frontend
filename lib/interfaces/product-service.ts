import type { Product, ProductInput, ProductUpdateInput } from "../types"

export interface ProductService {
  getProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  createProduct(input: ProductInput): Promise<Product>
  updateProduct(id: string, input: ProductUpdateInput): Promise<Product | null>
  deleteProduct(id: string): Promise<boolean>
}
