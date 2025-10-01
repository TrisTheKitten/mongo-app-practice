import Product from "@/models/Product";
import dbConnect from "@/lib/db";

const notFoundResponse = new Response(null, { status: 404 });

export async function GET(request, { params }) {
  await dbConnect();
  const product = await Product.findById(params.id).populate("category");
  if (!product) {
    return notFoundResponse;
  }
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const product = await Product.findByIdAndDelete(params.id);
  if (!product) {
    return notFoundResponse;
  }
  return Response.json(product);
}
