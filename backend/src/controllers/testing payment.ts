import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51Tp1UxPMYlVkoKaBlvclVB4jLbsywiC9uTgrnOM5mmtOGXRu2U5HZm9aWlnQM3M1WyBazfUCPi44lnGpsGLSo2ra00mdWKSuH3');

async function test() {
    try {
        // 1. Get an active price ID
        const prices = await stripe.prices.list({ limit: 1, active: true });
        if (prices.data.length === 0) {
            console.log("No active prices found on Stripe account.");
            return;
        }
        const priceId = prices.data[0].id;
        console.log("Using Price ID:", priceId);

        // 2. Create a customer
        const customer = await stripe.customers.create({
            email: 'test_scheduler@example.com',
            name: 'Test Scheduler',
        });
        console.log("Created Customer ID:", customer.id);

        // 3. Try to create subscription schedule
        const startDate = Math.floor(
            new Date("2026-07-29T00:00:00+05:30").getTime() / 1000
        );

        const schedule = await stripe.subscriptionSchedules.create({
            customer: customer.id,
            start_date: startDate,
            end_behavior: "cancel",
            phases: [
                {
                    items: [
                        {
                            price: priceId,
                            quantity: 1,
                        },
                    ],
                    duration: {
                        interval: "week",
                        interval_count: 1,
                    },
                },
            ],
        });
        console.log("Schedule created successfully:", schedule.id);
    } catch (err) {
        console.error("Error creating schedule:", err);
    }
}

test();

