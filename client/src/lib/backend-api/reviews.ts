import axios from "axios";

// ============================================================
// Reviews
// ============================================================
export async function createReview(review: { productId: string; rating: number; title: string; comment: string }) {
    try {
      const res = await axios.post(`/api/products/${review.productId}/reviews`, review);
      if (res.status === 201 && res.statusText === "Created") {
        return res;
      } else {
        console.warn("Failed to add a new review for the product");
        return false;
      }
  
    } catch (error) {
      console.error('Error during creating review:', error);
    }
  }