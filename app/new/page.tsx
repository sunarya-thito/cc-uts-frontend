
import { ProductForm } from "@/components/product-form"
import { getProductService } from "@/lib/product-service-provider"
import BackButton from "@/components/back-button"

export default function NewProduct() {

  const handleSubmit = async (formData: FormData) => {
    "use server"
    try {
      const name = formData.get("name") as string
      const price = formData.get("price") as string
      const image = formData.get("image") as string

      if (!name || !price || !image) {
        return
      }

      const productService = getProductService()
      await productService.createProduct({
        name,
        price: Number.parseFloat(price),
        image,
      })

    } catch (error) {
      console.error("Failed to create product:", error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <BackButton />

      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <ProductForm onSubmit={handleSubmit} />
    </div>
  )
}
