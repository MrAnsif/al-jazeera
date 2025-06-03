import { NextResponse } from 'next/server';
import Product from '@/models/product';
import cloudinary from '@/lib/cloudinary';
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

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const formData = await request.formData();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                { success: false, error: 'Invalid product ID format' },
                { status: 400 }
            );
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        const updateData = {
            name: formData.get('name') || existingProduct.name,
            description: formData.get('description') || existingProduct.description,
            updatedAt: new Date(),
        };

        const imageFiles = formData.getAll('images'); // input must have name="images"
        const uploadedImageUrls = [];

        for (const imageFile of imageFiles) {
            if (imageFile && imageFile.name !== 'undefined') {
                const imageArrayBuffer = await imageFile.arrayBuffer();
                const imageBuffer = Buffer.from(imageArrayBuffer);

                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream({ resource_type: 'auto' }, (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        })
                        .end(imageBuffer);
                });

                uploadedImageUrls.push(result.secure_url);
            }
        }

        if (uploadedImageUrls.length > 0) {
            updateData.images = uploadedImageUrls;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        return NextResponse.json({ success: true, data: updatedProduct });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                { success: false, error: 'Invalid product ID format' },
                { status: 400 }
            );
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}