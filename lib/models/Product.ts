import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    fabric: { type: String, required: true }, // e.g., Pink Leopard Print, Mauve Check
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: { type: [String], required: true }, // URLs or path paths: ['/images/products/tote1.jpg', ...]
    description: { type: String, required: true },
    dimensions: { type: String, default: '' },
    careInstructions: { type: String, default: '' },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
