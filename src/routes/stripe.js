import Stripe from "stripe";

export const stripe = new Stripe(import.meta.env.VITE_SEC_KEY, {
  apiVersion: "2023-10-16",
});
