
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/product-form"
import { getProductService } from "@/lib/product-service-provider"
import BackButton from "@/components/back-button"
import DeleteButton from "@/components/delete-button"

export default async function UpdateProduct({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id

  const product = await getProductService().getProduct(id)

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <BackButton />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <BackButton />
        </div>
      </div>
    )
  }

  const handleSubmit = async (formData: FormData) => {
    "use server"
    try {
      const name = formData.get("name") as string
      const price = Number.parseFloat(formData.get("price") as string)
      let image: string | null = formData.get("image") as string | null

      if (!name || !price) {
        throw new Error("Missing required fields")
      }

      const productService = getProductService()
      await productService.updateProduct(product.id, {
        name,
        price,
        image,
      })
    } catch (error) {
      console.error("Failed to update product:", error)
    }
  }

  const handleDelete = async () => {
    "use server"
    try {
      const productService = getProductService()
      await productService.deleteProduct(product.id)
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <BackButton />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <DeleteButton onClick={handleDelete} />
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        defaultValues={{
          name: product.name,
          price: product.price.toString(),
          image: product.image,
        }}
      />
    </div>
  )
}
