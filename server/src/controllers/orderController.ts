import { Stripe } from 'stripe';
import { config } from 'dotenv';

config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleStripeEvent = async (event: Stripe.Event) => {
    const eventType = event.type;
    // let data = event.data.object;
    const intent: any = event.data.object
    let response;

    switch (eventType) {
        case 'checkout.session.completed':
            //------------INTEENT------------------
            const paymentIntentId: string = intent.payment_intent;
            const paymentIntent = intent as Stripe.PaymentIntent;
            //------------CUSTOMER------------------
            const customerId: string = paymentIntent.customer as string;
            const customer = await stripe.customers.retrieve(customerId);
            //------------PAYMENT------------------
            const charges = await stripe.charges.list({ payment_intent: paymentIntentId });
            const paymentMethodId = charges.data[0]?.payment_method;
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId!);

            console.log({customer, paymentIntent, paymentMethod});
            response = { success: true };

            break;
        case 'payment_intent.succeeded':
            // Handle successful payment
            response = { success: true, message: 'Payment succeeded' };
            break;

        case 'payment_intent.payment_failed':
            // Handle payment failure
            response = { success: false, message: 'Payment failed' };
            break;

        default:
            response = { success: false, message: 'Unhandled event type' };
    }

    return response;
};