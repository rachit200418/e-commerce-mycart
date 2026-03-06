const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: { type: String, enum: ['COD', 'UPI', 'Card', 'NetBanking'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Processing'
  },
  itemsPrice: Number,
  shippingPrice: { type: Number, default: 0 },
  taxPrice: Number,
  totalPrice: Number,
  deliveredAt: Date,
  trackingSteps: [{
    status: String,
    date: Date,
    location: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
