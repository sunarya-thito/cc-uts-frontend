import ProductList from "@/components/product-list";
import { getProductService } from "@/lib/product-service-provider";

export default async function Home() {
  const products = await getProductService().getProducts();
  return <ProductList products={products} />;
}