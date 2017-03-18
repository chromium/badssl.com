var domain = document.location.hostname || "badssl.test";
var sanityCheckOrigin = "https://" + domain;

function createSpinner() {
  var spinner = document.createElement("span");
  spinner.classList.add("spinner");
  return spinner;
}

function calculateOrigin(config) {
  var origin = "https://" + config.subdomain + "." + domain;
  if (config.port) {
    origin += ":" + config.port;
  }
  return origin;
}

var verdict = {
  yes:   "✅ YES", // ✅✔
  maybe: "🆗 OKAY", // 🆗🤔
  no:    "❌ NO", // ❌✖
}

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

function test(origin, set, tr) {
  request(
    origin,
    function() {
      tr.classList.add("expected-" + set.success);
      tr.querySelector(".result").textContent = "connected";
      tr.querySelector(".expected").textContent = verdict[set.success];
    },
    function() {
      tr.classList.add("expected-" + set.fail);
      tr.querySelector(".result").textContent = "cannot connect";
      tr.querySelector(".expected").textContent = verdict[set.fail];
    }
  );

}

function createChild(parent, tag) {
  var elem = document.createElement(tag);
  parent.appendChild(elem);
  return elem;
}

function scanSet(set, container) {
  createChild(container, "h2").textContent = set.heading;

  var table = createChild(container, "table");
  
  var thead = createChild(table, "thead");
  createChild(thead, "td").textContent = "Subdomain";
  createChild(thead, "td").textContent = "Result";
  createChild(thead, "td").textContent = "Expected";

  var tbody = createChild(table, "tbody");

  for (var i = 0; i < set.subdomains.length; i++) {
    var config = set.subdomains[i];

    var origin = calculateOrigin(config);

    var tr = createChild(tbody, "tr");

    var tdSubdomain = createChild(tr, "td");
    var a = createChild(tdSubdomain, "a");
    a.href = origin;
    a.textContent = config.subdomain;
    a.target = "_blank";

    var tdResult = createChild(tr, "td");
    tdResult.classList.add("result");
    tdResult.appendChild(createSpinner());

    var tdExpected = createChild(tr, "td");
    tdExpected.classList.add("expected");
    tdExpected.appendChild(createSpinner());

    test(origin, set, tr)
  }
}

function error(e) {
  document.querySelector("#message").textContent = "ERROR: " + e;
  console.error(e);
}

function scan() {
  var tableWrapper = document.querySelector("#table-wrapper");
  request(sanityCheckOrigin, function() {
    try {
      for (var i = 0; i < sets.length; i++) {
        scanSet(sets[i], tableWrapper);
      }
      document.body.removeChild(document.querySelector("#message"));
      tableWrapper.classList.remove("hidden");
    } catch(e) {
      error(e);
    }
  }, function() {
    error("Could not connect to test server.");
  });
}

window.addEventListener("load", scan);
