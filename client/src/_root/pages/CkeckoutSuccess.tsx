import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useLocation } from "react-router-dom";
import { OrderInvoice } from "@/components/shared";
import { useGetOrderBySessionId } from "@/lib/react-query/queries/order-queries";

const CkeckoutSuccess: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get('session_id');

  const { clearCart } = useCart();
  const { data: order, isLoading: orderLoading, isError: orderError } = useGetOrderBySessionId(sessionId!);

  useEffect(() => { clearCart() }, [order, clearCart]);

  if (orderLoading) {
    return <div>Loading...</div>;
  }

  if (orderError) {
    return <div>Error loading order</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }

  console.log(order)

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center font-inter">
      <div className="w-full px-8 md:px-52 py-28 my-20 max-w-screen-xl border rounded-2xl relative">
        <OrderInvoice order={order} key={order._id} />
      </div>
    </div>
  );
};

export default CkeckoutSuccess;
