import type { ProductService } from "./interfaces/product-service"
import { DummyProductService } from "./implementations/dummy-product-service"
import { LocalStorageProductService } from "./implementations/local-storage-product-service"
import { ApiProductService } from "./implementations/api-product-service"

// Determine which implementation to use
// You can change this to use different implementations
// Options: "dummy", "localStorage", "api"
const IMPLEMENTATION = "api"

// Factory function to get the appropriate product service implementation
export function getProductService(): ProductService {
  return new ApiProductService();
}
