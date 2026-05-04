const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      event.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;

      const email = session.customer_details?.email;
      const priceId = session.metadata?.price_id;

      let plan = "free";

      if (priceId === process.env.HOUSE_PRICE_ID) {
        plan = "house";
      }

      if (priceId === process.env.M_LIST_PRICE_ID) {
        plan = "m-list";
      }

      if (email && plan !== "free") {
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: plan,
            stripe_customer_id: session.customer
          })
          .eq("email", email);
      }
    }

    if (stripeEvent.type === "customer.subscription.deleted") {
      const subscription = stripeEvent.data.object;

      await supabaseAdmin
        .from("profiles")
        .update({ plan: "free" })
        .eq("stripe_customer_id", subscription.customer);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};