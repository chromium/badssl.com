function appendLog(msg) {
  console.log(msg);
  let logList = document.getElementById('log');
  let logEntry = document.createElement('li');
  let logText = document.createTextNode(msg);
  logEntry.appendChild(logText);
  logList.appendChild(logEntry);
}

function clearLog() {
  let logList = document.getElementById('log');
  while (logList.firstChild) {
    logList.removeChild(logList.firstChild);
  }
}

function toggleLogVisibility() {
  let logList = document.getElementById('log');
  let logToggle = document.getElementById('log-toggle');
  if (logList.hidden) {
    logToggle.innerHTML = 'Hide log';
    logList.hidden = false;
  } else {
    logToggle.innerHTML = 'Show log';
    logList.hidden = true;
  }
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
    appendLog('canMakePayment returned: ' + result);
  }).catch(function(err) {
    appendLog('canMakePayment rejected: ' + err.name + ': ' + err.message);
  });
  request.hasEnrolledInstrument().then(function(result) {
    appendLog('hasEnrolledInstrument returned: ' + result);
  }).catch(function(err) {
    appendLog('hasEnrolledInstrument rejected: ' + err.name + ': ' + err.message);
  });
  return request;
}

let request = initPaymentRequest();

/** Invokes PaymentRequest for credit cards. */
function handleClick() {
  clearLog();
  request.show().then(function(instrumentResponse) {
    appendLog('show returned: ' + JSON.stringify(instrumentResponse));
    request = initPaymentRequest();
    return instrumentResponse.complete('success');
  })
  .catch(function(err) {
    appendLog('show rejected: ' + err.name + ': ' + err.message);
    request = initPaymentRequest();
  });

}
