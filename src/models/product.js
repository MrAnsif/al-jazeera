import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number },
  images: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);