import express, { Request, Response } from "express";
import Stripe from "stripe";
import { config } from 'dotenv';
import asyncHandler from "../middlewares/asyncHandler";

config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const router = express.Router();

router.post("/create-payment-intent", express.json(), asyncHandler(async (req: Request, res: Response) => {

    const { amount } = req.body;

    // const customer = await stripe.customers.create({
    //     metadata: {
    //         userId: userId,
    //         cart: JSON.stringify(orders)
    //     }
    // })

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'gbp',
        payment_method_types: ["card", "paypal"]
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
        // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
}));

export default router;