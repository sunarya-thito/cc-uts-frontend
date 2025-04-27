import ProductList from "@/components/product-list";
import { getProductService } from "@/lib/product-service-provider";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProductService().getProducts();
  return <ProductList products={products} />;
}