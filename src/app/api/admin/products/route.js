import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
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

export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');

        const imageFiles = formData.getAll('images');
        const uploadedUrls = [];

        for (const file of imageFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ resource_type: 'auto' }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    })
                    .end(buffer);
            });

            uploadedUrls.push(result.secure_url);
        }

        const product = await Product.create({
            name,
            description,
            category,
            price,
            images: uploadedUrls,
        });

        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
