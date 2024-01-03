import { stripe } from "../stripe";

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const cartItems = data.items;
    const countMap = data.countMap;
    const countMapInt = {};
    for (const key in countMap) {
      countMapInt[parseInt(key)] = countMap[key];
    }

    // Merge cartItems and countMap based on the product ID
    const mergedArray = cartItems.map((item) => ({
      ...item,
      quantity: countMapInt[item.id] || 1,
    }));

    const lineItems = mergedArray.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: item.product_name,
          images: [item.product_image_d],
        },
        unit_amount: item.product_price * 100,
      },
      quantity: item.quantity,
    }));

    // Create session for redirecting users
    // const lineItems = cartItems.map((item) => {
    //   return {
    //     price_data: {
    //       currency: "INR",
    //       product_data: {
    //         name: item.product_name,
    //         images: [item.product_image_d],
    //       },
    //       unit_amount: item.product_price * 100,
    //     },
    //     quantity: 3,
    //   };
    // });

    // Create session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      mode: "payment",
      success_url: `http://localhost:5173/success`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    return new Response(
      JSON.stringify({
        url: session.url,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during checkout:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
