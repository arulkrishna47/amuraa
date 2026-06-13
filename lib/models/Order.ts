import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  fabric: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const ShippingAddressSchema = new Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true }
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // Null for guest checkouts
    email: { type: String, required: true }, // Contact email for checkout notification
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    totalAmount: { type: Number, required: true },
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Failed'], 
      default: 'Pending' 
    },
    paymentMethod: { type: String, default: 'Stripe' },
    paymentIntentId: { type: String, default: '' },
    orderStatus: { 
      type: String, 
      enum: ['Processing', 'Shipped', 'Delivered'], 
      default: 'Processing' 
    },
    trackingNumber: { type: String, default: '' },
    carrier: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
