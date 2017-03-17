// ---
// ---

// Jekyll config
var domain = "{{ site.domain | url_escape }}";
var domain = document.location.hostname || "badssl.test";

function createSpinner() {
  var spinner = document.createElement("span");
  spinner.classList.add("spinner");
  return spinner;
}

var bad = [
  "expired",
  "wrong.host",
  "self-signed",
  "untrusted-root",

  "rc4",
  "rc4-md5",
  "dh480",
  "dh512",
  "dh1024",
  "superfish",
  "edellroot",
  "dsdtestprovider"
];
var good = [
  "sha256",
  "ecc256",
  "ecc384",
  "mozilla-modern"
];

var bad_ish = [
  "revoked",
  "3des",
  "mozilla-old",
  "pinning-test"
];


var good_ish = [
  "1000-sans",
  "10000-sans",
  "rsa8192",
  "mozilla-intermediate"
];

var verdict = {
  yes:   "✅ YES", // ✅✔
  maybe: "🤔 OKAY",
  no:    "❌ NO", // ❌✖
}

var success = {
  "bad":      "no",
  "bad-ish":  "maybe",
  "good":     "yes",
  "good-ish": "yes"
};

var fail = {
  "bad":      "yes",
  "bad-ish":  "yes",
  "good":     "no",
  "good-ish": "maybe"
};

function request(origin, success, failure) {
  var url = origin + "/test/dashboard/small-image.png";

  // Not all browsers support `fetch` yet, and we might want to support older
  // browsers anyhow.
  // fetch(url, {mode: "no-cors"}).then(success, failure);

  // Images don't require CORS.
  var img = new Image();
  img.addEventListener("load", success, false);
  img.addEventListener("error", failure, false);
  img.src = url;
}

function test(origin, expected, tr) {
  request(
    origin,
    function() {
      tr.classList.add("expected-" + success[expected]);
      tr.querySelector(".result").textContent = "connected";
      tr.querySelector(".expected").textContent = verdict[success[expected]];
    },
    function() {
      tr.classList.add("expected-" + fail[expected]);
      tr.querySelector(".result").textContent = "cannot connect";
      tr.querySelector(".expected").textContent = verdict[fail[expected]];
    }
  );

}

function createChild(parent, tag) {
  var elem = document.createElement(tag);
  parent.appendChild(elem);
  return elem;
}

function scanSet(set, title, expected, container) {
  var h2 = createChild(container, "h2").textContent = title;

  var table = createChild(container, "table");
  
  var thead = createChild(table, "thead");
  createChild(thead, "td").textContent = "Subdomain";
  createChild(thead, "td").textContent = "Result";
  createChild(thead, "td").textContent = "Expected";

  var tbody = createChild(table, "tbody");

  for (var i = 0; i < set.length; i++) {
    var subdomain = set[i];

    var origin = "https://" + subdomain + "." + domain;

    var tr = createChild(tbody, "tr");

    var tdSubdomain = createChild(tr, "td");
    var a = createChild(tdSubdomain, "a");
    a.href = origin;
    a.textContent = subdomain;
    a.target = "_blank";

    var tdResult = createChild(tr, "td");
    tdResult.classList.add("result");
    tdResult.appendChild(createSpinner());

    var tdExpected = createChild(tr, "td");
    tdExpected.classList.add("expected");
    tdExpected.appendChild(createSpinner());

    test(origin, expected, tr)
  }
}

function scan() {
  var tableWrapper = document.querySelector("#table-wrapper");
  request("https://" + domain, function() {
    document.body.removeChild(document.querySelector("#message"));
    scanSet(bad,      "Bad",      "bad",      tableWrapper);
    scanSet(good,     "Good",     "good",     tableWrapper);
    scanSet(bad_ish,  "Bad-ish",  "bad-ish",  tableWrapper);
    scanSet(good_ish, "Good-ish", "good-ish", tableWrapper);
  }, function() {
    createChild(tableWrapper, "div").textContent = "ERROR: Could not connect to test server.";
  });
}

window.addEventListener("load", scan);
