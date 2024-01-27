import OrderInvoice from "@/components/root/OrderInvoice";
import { useGetMyOrders } from "@/lib/react-query/queries";
import { useParams } from "react-router-dom";

const CkeckoutSuccess: React.FC = () => {
  const { id } = useParams();
  const { data: orders, isLoading: orderLoading, isError: orderError } = useGetMyOrders();

  if (orderLoading) {
    return <div>Loading...</div>;
  }

  if (orderError) {
    return <div>Error loading order</div>;
  }

  if (!orders) {
    return <div>No order found</div>;
  }

  console.log(orders)

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center font-inter">
      <div className="w-full px-8 md:px-52 py-28 my-20 max-w-screen-xl border rounded-2xl relative">
        <OrderInvoice order={orders[orders.length - 1]} key={orders[orders.length - 1]._id} />
      </div>
    </div>
  );
};

export default CkeckoutSuccess;
