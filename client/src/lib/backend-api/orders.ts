import { Order } from "@/types/order";
import axios from "axios";

// ============================================================
// ORDERS
// ============================================================

export async function getOrders() {
    try {
        const { data } = await axios.get(`/api/orders`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getOrdersBySessionId = async (sessionId: string) => {
    try {
        const response = await axios.get(`/api/orders/${sessionId}`);
        if (response.status === 200) {
            return response.data.order as Order;
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export async function getMyOrders() {
    try {
        const response = await axios.get(`/api/orders/my-orders`);
        if (response.status === 200) {
            return response.data.orders as Order[];
        }
    } catch (error) {
        console.log(error);
    }
}

export async function createOrder(data: {
    orders: { productId: string; quantity: number }[];
    userId: string;
}) {
    try {
        const { data: responseData } = await axios.post("/api/stripe/create-checkout-session", data);

        if (responseData && responseData.url) {
            window.location.href = responseData.url;
        }

        return responseData;
    } catch (error) {
        console.error("Error during checkout:", error);
    }
}

export async function updateShippingStatus(order: {
    orderId: string;
    status: string;
}) {
    try {
        const res = await axios.post("/api/orders/update-shipping-status", order);
        if (res.status === 200 && res.statusText === "OK") {
            return res;
        } else {
            console.warn("Failed to add a new review for the product");
            return false;
        }
    } catch (error) {
        console.error("Error during checkout:", error);
    }
}
