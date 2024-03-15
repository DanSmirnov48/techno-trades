import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import {
    getOrders,
    getOrdersBySessionId,
    getMyOrders,
    createOrder,
    updateShippingStatus,
} from "../../backend-api/orders";

// ============================================================
// ORDERS
// ============================================================
export const useGetOrders = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ORDERS],
        queryFn: () => getOrders(),
    });
};

export const useGetOrderBySessionId = (sessionId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ORDER_BY_SESSION_ID, sessionId],
        queryFn: () => getOrdersBySessionId(sessionId),
        enabled: !!sessionId,
    });
};

export const useGetMyOrders = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_MY_ORDERS],
        queryFn: () => getMyOrders(),
    });
};

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (data: {
            orders: { productId: string; quantity: number }[];
            userId: string;
        }) => createOrder(data),
        onSuccess: (data) => {
            console.log("success", data);
        },
    });
};

export const useUpdateShippingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (order: { orderId: string; status: string }) =>
            updateShippingStatus(order),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ORDERS],
            });
        },
    });
};
