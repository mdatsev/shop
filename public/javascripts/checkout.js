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

const showError = message => {
  $('#modal-error').text(message);
  $('#error-modal').modal();
};

const handleServerResponse = async (response) => {
  if (response.error) {
    showError(response.error);
  } else if (response.requires_action) {
    console.log('requires action', response);
    const { error: errorAction, paymentIntent } =
      await stripe.handleCardAction(response.payment_intent_client_secret);

    if (errorAction) {
      showError('Error. Please try again.');
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
    // eslint-disable-next-line no-undef
    clearBasket();
    $('#success-modal').modal({ backdrop: 'static', keyboard: false });
  }
};

cardButton.addEventListener('click', async (ev) => {
  const { paymentMethod, error } =
    await stripe.createPaymentMethod('card', cardElement, {
      billing_details: { name: cardholderName.value },
    });

  if (error) {
    if (error.type === 'validation_error') {
      showError(error.message);
    } else if (
      error.type === 'invalid_request_error' &&
      error.code === 'parameter_invalid_empty' &&
      error.param === 'billing_details[name]'
    ) {
      showError('Full name is required.');
    } else {
      showError('Payment error. Please try again.');
      console.error('payment error', error);
    }
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
