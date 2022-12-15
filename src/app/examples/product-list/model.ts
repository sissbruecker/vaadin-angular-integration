export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export function generateProducts(count: number) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product: Product = {
      id: i,
      name: `Product ${i}`,
      description: `Description ${i}`,
      price: i,
    };
    products.push(product);
  }
  return products;
}
