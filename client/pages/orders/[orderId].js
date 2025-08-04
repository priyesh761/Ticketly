import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const OrderDetails = ({ order, currentUser }) => {
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

  const { doRequest, errors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: { orderId: order.id },
    onSuccess: () => Router.push("/orders"),
  });

  if (timeLeft <= 0) {
    return <div>Order has expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDetails;
