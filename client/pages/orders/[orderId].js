import { useEffect, useState } from "react";

const OrderDetails = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState("0");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft <= 0) {
    return <div>Order has expired</div>;
  }
  return <div>Time left to pay: {timeLeft} seconds</div>;
};

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDetails;
