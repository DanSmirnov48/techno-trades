import mongoose, { Document, Schema } from 'mongoose';

interface OrderProduct {
    productId: string;
    quantity: number;
}

interface OrderShippingAddress {
    city: string;
    country: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    state: string;
}

interface OrderShippingCost {
    amount_subtotal: number;
    amount_tax: number;
    amount_total: number;
    shipping_rate: string;
}

interface PaymentIntentDetails {
    id: string;
    object: string;
    billing_details: {
        address: {
            city: string;
            country: string;
            line1: string;
            line2: string | null;
            postal_code: string;
            state: string | null;
        };
        email: string;
        name: string;
        phone: string | null;
    };
    card: {
        brand: string;
        country: string;
        exp_month: number;
        exp_year: number;
        last4: string;
    };
    metadata: Record<string, any>;
    type: string;
}

interface Order {
    userId: string;
    customerId: string;
    customerEmail: string;
    paymentIntentId: string;
    paymentIntentDetails: PaymentIntentDetails;
    products: OrderProduct[];
    subtotal: number;
    total: number;
    shippingAddress: OrderShippingAddress;
    shippingCost: OrderShippingCost;
    deliveryStatus: string;
    paymentStatus: string;
}

export interface OrderDocument extends Order, Document { }

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    customerId: { type: String, required: true },
    customerEmail: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    paymentIntentDetails: { type: Object, required: true },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shippingAddress: { type: Object, required: true },
    shippingCost: {
        amount_subtotal: { type: Number },
        amount_tax: { type: Number },
        amount_total: { type: Number },
        shipping_rate: { type: String },
    },
    deliveryStatus: { type: String, default: "pending" },
    paymentStatus: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true },
}, {
    timestamps: true
})

const Order = mongoose.model<OrderDocument>('Order', OrderSchema);

export default Order;