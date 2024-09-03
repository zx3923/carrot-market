import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";

async function getInitialProducts(id: number) {
  const data = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
      sale_status: true,
    },
    where: {
      sales: {
        some: {
          sellerId: id,
        },
      },
    },
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });
  return data;
}

export type InitialSales = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Sale() {
  const session = await getSession();
  const initialProducts = await getInitialProducts(session.id!);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">판매 내역</h1>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
