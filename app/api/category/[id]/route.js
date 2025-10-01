import Category from "@/models/Category";
import dbConnect from "@/lib/db";

const notFoundResponse = new Response(null, { status: 404 });

export async function GET(request, { params }) {
    await dbConnect();
    const category = await Category.findById(params.id);
    if (!category) {
        return notFoundResponse;
    }
    return Response.json(category);
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
        return notFoundResponse;
    }
    return Response.json(category);
}