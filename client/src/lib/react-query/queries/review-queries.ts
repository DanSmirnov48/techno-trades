import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { createReview } from "../../backend-api/reviews";

// ============================================================
// REVIEWS
// ============================================================
export const useCreateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (review: { productId: string; rating: number; title: string; comment: string }) =>
            createReview(review),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCT_BY_ID, data],
            });
        },
    });
};