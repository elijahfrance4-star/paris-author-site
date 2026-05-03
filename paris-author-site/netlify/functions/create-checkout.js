const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  try {
    const { book } = JSON.parse(event.body || "{}");

    const products = {
      "if-love": {
        name: "If Love Could Talk - Preorder",
        price: 499
      },
      "summer-kings": {
        name: "Summer Kings - Preorder",
        price: 999
      }
    };

    const selected = products[book];

    if (!selected) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid book selected" })
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selected.name
            },
            unit_amount: selected.price
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/preorder.html`
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