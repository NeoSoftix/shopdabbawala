import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../config/stripe";
import PaymentForm from "../components/User/PaymentForm";

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}