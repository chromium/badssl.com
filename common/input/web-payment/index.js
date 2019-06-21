function append(msg) {
  console.log(msg);
  const footer = document.getElementById('footer');
  footer.innerHTML = footer.innerHTML + '<br>' + msg;
}

function clearOutput() {
  document.getElementById('footer').innerHTML = '';
}

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
    append('canMakePayment returned: ' + result);
  }).catch(function(err) {
    append('canMakePayment rejected: ' + err.name + ': ' + err.message);
  });
  request.hasEnrolledInstrument().then(function(result) {
    append('hasEnrolledInstrument returned: ' + result);
  }).catch(function(err) {
    append('hasEnrolledInstrument rejected: ' + err.name + ': ' + err.message);
  });
  return request;
}

let request = initPaymentRequest();

/** Invokes PaymentRequest for credit cards. */
function handleClick() {
  clearOutput();
  request.show().then(function(instrumentResponse) {
    append('show returned: ' + JSON.stringify(instrumentResponse));
    request = initPaymentRequest();
    return instrumentResponse.complete('success');
  })
  .catch(function(err) {
    append('show rejected: ' + err.name + ': ' + err.message);
    request = initPaymentRequest();
  });

}
