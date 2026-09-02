import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Yeni Ürün</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
