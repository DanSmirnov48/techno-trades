import express, { Request, Response } from "express";
import Stripe from "stripe";
import { config } from 'dotenv';
import { IProduct, ProductModel } from "../models/products";
import asyncHandler from "../middlewares/asyncHandler";

config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const router = express.Router();

router.post("/create-checkout-session", express.json(), asyncHandler(async (req: Request, res: Response) => {

    const { userId, orders } = req.body;

    const customer = await stripe.customers.create({
        metadata: {
            userId: userId,
            cart: JSON.stringify(orders)
        }
    })

    try {
        const line_items = await Promise.all(orders.map(async (item: any) => {
            const product = await ProductModel.findById(item.productId) as IProduct;
            if (!product) {
                console.error(`Product not found for id: ${item.productId}`);
                return null;
            }
            if (item.quantity > product.countInStock) {
                console.error(`Insufficient stock for product: ${product.name}`);
                return res.status(400).send({ error: `Insufficient stock for product: ${product.name}` });
            }

            const images = product.image.map(img => img.url);
            const price = product.isDiscounted ? product.discountedPrice! : product.price;

            const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: product.name,
                        images: images,
                        metadata: {
                            id: product._id,
                        }
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: item.quantity,
            };

            return lineItem;
        }));

        const validLineItems = line_items.filter(Boolean);

        if (validLineItems.length === 0) {
            console.error("No valid line items found.");
            return res.status(400).send({ error: "Invalid request. No valid line items found." });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'gbp',
                        },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 1500,
                            currency: 'gbp',
                        },
                        display_name: 'Next day air',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 1,
                            },
                        },
                    },
                },
            ],
            line_items: validLineItems,
            mode: "payment",
            customer: customer.id,
            success_url: `${process.env.CLIENT_URL}/checkout-success`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
        });

        res.send({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}));

router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req: Request, res: Response) => {
    const stripeSignature = req.headers['stripe-signature'] as string;
    if (!stripeSignature) {
        throw new Error('No stripe signature found!');
    }

    const stripePayload = (req as any).rawBody || req.body.toString();
    const stripeSecret = process.env.STRIPE_TEST_KEY!;

    try {
        const event = stripe.webhooks.constructEvent(stripePayload, stripeSignature, stripeSecret);
        console.log('Webhook verified');
        console.log(event)
    } catch (err: any) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`).end();
    }
}));

export default router;