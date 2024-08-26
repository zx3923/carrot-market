"use server";

import { z } from "zod";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.coerce.number({
    required_error: "Price is required",
  }),
  id: z.coerce.number(),
});

export async function editAction(prevState: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    id: formData.get("id"),
  };
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const updateProduct = await db.product.update({
        where: {
          id: result.data.id,
        },
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          // user: {
          //   connect: {
          //     id: session.id,
          //   },
          // },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${updateProduct.id}`);
      //redirect("/products")
    }
  }
}
