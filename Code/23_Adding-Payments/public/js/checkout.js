const STRIPE_PK = 'pk_test_51LTzlTKBKIaskN21qoo598tFLSwz96qpHQegZHeFesYy3l9Cu94hnFW7IDjCoxUp5GTtjLcLr5UBBWBMTiALFAGM00BkXGrsOU';
const stripe = Stripe(STRIPE_PK);
const orderBtn = document.querySelector('#order-btn');
orderBtn.addEventListener('click', async () => {
    console.log(orderBtn.dataset.sessionid);
    const {error} = await stripe.redirectToCheckout({
        sessionId: orderBtn.dataset.sessionid
    });
    if (error) console.error(error);
});