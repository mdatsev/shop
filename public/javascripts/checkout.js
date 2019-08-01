/* eslint-disable no-undef */

const stripe = Stripe('pk_test_Lgp6NNZjmFW3OiuAT7ONHaas00Ftld48D9');

const elements = stripe.elements({
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css?family=Quicksand',
    },
  ],
  locale: 'auto',
});
const cardElement = elements.create('card', { iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#525f7f',
      color: '#525f7f99',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      ':-webkit-autofill': {
        color: '#525f7f99',
      },
      '::placeholder': {
        color: '#525f7f99',
      },
    },
    invalid: {
      iconColor: '#FF575E',
      color: '#FF575E',
    },
  },
});

cardElement.mount('#card-element');

const cardholderName = document.getElementById('cardholder-name');
const cardButton = document.getElementById('card-button');

const handleServerResponse = async (response) => {
  if (response.error) {
    console.error('response error', response.error);
  } else if (response.requires_action) {
    console.log('requires action', response);
    const { error: errorAction, paymentIntent } =
      await stripe.handleCardAction(response.payment_intent_client_secret);

    if (errorAction) {
      console.error('action error', errorAction);
    } else {
      const serverResponse = await fetch('/ajax/confirm_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
      });

      handleServerResponse(await serverResponse.json());
    }
  } else {
    console.log('success');
  }
};

cardButton.addEventListener('click', async (ev) => {
  const { paymentMethod, error } =
    await stripe.createPaymentMethod('card', cardElement, {
      billing_details: { name: cardholderName.value },
    });

  if (error) {
    console.error('payment error', error);
  } else {
    const response = await fetch('/ajax/confirm_payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_method_id: paymentMethod.id }),
    });

    const json = await response.json();

    handleServerResponse(json);
  }
});
