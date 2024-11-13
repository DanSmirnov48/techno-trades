import express, { Request, Response } from "express";
import Stripe from "stripe";
import { config } from 'dotenv';
import asyncHandler from "../middlewares/asyncHandler";
import { IProduct, ProductModel } from "../models/products";
import { authMiddleware } from "../middlewares/auth";
import { ErrorCode, RequestError } from "../config/handlers";
import { CustomResponse } from "config/utils";

config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const router = express.Router();

interface OrderItem {
    productId: string;
    quantity: number;
}

router.post("/create-payment-intent", express.json(), authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const user = req.user
    const { userId, order } = req.body as { userId: string; order: OrderItem[] };

    if (!user || user._id.toString() !== userId) {
        throw new RequestError("Invalid User", 401, ErrorCode.INVALID_OWNER);
    }

    let amount = 0;
    let errors: string[] = [];

    await Promise.all(order.map(async (item) => {
        const product = await ProductModel.findById(item.productId) as IProduct;
        if (!product) {
            errors.push(`Product not found for id: ${item.productId}`);
            return;
        }
        if (item.quantity > product.countInStock) {
            errors.push(`Insufficient stock for product: ${product.name}`);
            return;
        }
        const price = product.isDiscounted ? product.discountedPrice! : product.price;
        amount += price * item.quantity;
    }));

    if (errors.length > 0) {
        return res.status(400).json(CustomResponse.error("An error at '/create-payment-intent'", "400", { errors }))
    }

    const customer = await stripe.customers.create({
        name: user.firstName + " " + user.lastName,
        email: user.email,
        metadata: {
            userId: user._id.toString(),
            cart: JSON.stringify(order)
        }
    })

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'gbp',
        payment_method_types: ["card", "paypal"],
        customer: customer.id,
        metadata: {
            userId: user._id.toString(),
            cart: JSON.stringify(order),
            amount: amount,
        }
    });

    res.send({ clientSecret: paymentIntent.client_secret });
}));

export default router;