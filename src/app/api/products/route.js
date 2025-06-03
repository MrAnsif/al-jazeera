import { NextResponse } from 'next/server';
import Product from '@/models/product';
import connectMongo from '@/lib/mongodb';

await connectMongo()

export async function GET() {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
