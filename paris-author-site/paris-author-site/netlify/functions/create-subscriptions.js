const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { priceId } = JSON.parse(event.body || "{}");

    const allowedPrices = [
      process.env.price_1TT34DHc9WckJ9kJIjRd5m9X 
      process.env.price_1TT34lHc9WckJ9kJJeqy0fCB    
    ];

    if (!allowedPrices.includes(priceId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid subscription price." })
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      metadata: {
        price_id: priceId
      },
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/subscriptions.html`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};