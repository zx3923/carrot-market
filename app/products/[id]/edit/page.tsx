import EditForm from "@/components/edit-form";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      photo: true,
      title: true,
      price: true,
      description: true,
      id: true,
    },
  });
  return product;
}

export default async function EditPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  console.log(id);
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }

  return <EditForm product={product} />;
}
