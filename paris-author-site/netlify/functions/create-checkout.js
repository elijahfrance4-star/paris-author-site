const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  try {
    const { cart } = JSON.parse(event.body || "{}");

    const products = {
      "if-love": {
        name: "If Love Could Talk",
        price: 1599
      },
      "summer-kings": {
        name: "Summer Kings",
        price: 2599
      }
    };

    if (!cart || cart.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Cart is empty" })
      };
    }

    const line_items = cart.map(item => {
      const product = products[item.bookId];

      if (!product) {
        throw new Error("Invalid product in cart");
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name
          },
          unit_amount: product.price
        },
        quantity: item.quantity || 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      line_items,
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/cart.html`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};