/**
 * Builds PaymentRequest for credit cards, but does not show any UI yet.
 * @return {PaymentRequest} The PaymentRequest object.
 */
function initPaymentRequest() {
  const request = new PaymentRequest(
      [{
        supportedMethods: ['basic-card'],
      }],
      {
        total: {
          label: 'Total',
          amount: {
            currency: 'USD',
            value: '1.00',
          },
        },
      });
  request.canMakePayment().then(function(result) {
    console.log(result);
  }).catch(function(err) {
    console.log(err);
  });
  return request;
}

let request = initPaymentRequest();

/** Invokes PaymentRequest for credit cards. */
function handleClick() {
  request.show()
      .then(function(instrumentResponse) {
        return instrumentResponse.complete('success');
      })
      .catch(function(err) {
        console.log(err);
      });

  request = initPaymentRequest();
}
