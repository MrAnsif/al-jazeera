import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectMongo from '@/lib/mongodb';

await connectMongo()

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                { success: false, error: 'Invalid product ID format' },
                { status: 400 }
            );
        }
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
