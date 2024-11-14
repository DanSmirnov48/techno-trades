import { useEffect, useState } from 'react';
import { Appearance, loadStripe, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import {
    Elements,
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Icons } from './shared';
import { useUserContext } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PRIVATE_KEY);

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/completion`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An error occurred");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    }

    const options: StripePaymentElementOptions = {
        fields: {
            billingDetails: {
                address: {
                    country: 'never',
                    postalCode: 'never',
                }
            }
        },
        layout: {
            type: 'accordion',
        },
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className='w-full max-w-[650px]'>
            <PaymentElement id="payment-element" options={options} />
            <Button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-dark-4 py-7 dark:text-white/90 text-lg mt-10"
                size="lg"
                onClick={() => (console.log("first"))}
            >
                {isLoading ?
                    <div className="spinner" id="spinner"></div> :
                    <>
                        <Icons.visa className="w-16 bg-light-2 rounded-md p-1.5 mr-2" />
                        Place order
                    </>
                }
            </Button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    )
}

const StripeCheckout = () => {
    const { items } = useCart();
    const { user, isAuthenticated } = useUserContext();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const order = items.map(({ product, quantity }) => {
                    return {
                        productId: product._id!,
                        quantity: quantity,
                    };
                });

                const response = await axios.post("/api/stripe/create-payment-intent", {
                    userId: user._id,
                    order: order
                });

                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.error("Error fetching payment intent:", error);
            }
        };

        fetchPaymentIntent();
    }, [items, user._id]);

    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0047AB',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
        },
        rules: {
            '.Label': {
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280'
            },
            '.Input': {
                padding: '12px',
                fontSize: '16px',
                color: '#1f2937',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '4px'
            },
            '.AccordionItem': {
                padding: '20px 120px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
            }
        }
    };

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: appearance,
        loader: 'auto',
    };

    return (
        clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={options}>
                {isAuthenticated && <CheckoutForm />}
            </Elements>
        )
    );
};

export default StripeCheckout;