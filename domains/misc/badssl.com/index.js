
function getBrowserVersion(ua) {
  var ua = navigator.userAgent;

  var regexes = [

    [/^.*Edge\/([\d\.]*)\b.*$/, "Edge $1"],
    [/^.*CriOS\/([\d\.]*)\b.*$/, "Chrome $1"],
    [/^.*Firefox\/([\d\.]*)\b.*$/, "Firefox $1"],
    [/^.*OPR\/([\d\.]*)\b.*$/, "Opera $1"],
    [/^.*Vivaldi\/([\d\.]*)\b.*$/, "Vivaldi $1"],
    [/^.*OPiOS\/([\d\.]*)\b.*$/, "Opera Mini $1"],
    [/^.*FxiOS\/([\d\.]*)\b.*$/, "Firefox (for iOS) $1"],
    [/^.*Chrome\/([\d\.]*)\b.*$/, "Chrome $1"],
    /* This has to go last: Safari has "Version/8.0.5 Safari/600.5.17", but "Safari/600.5.17" is the WebKit version, which Chrome and Opera also include.*/
    [/^.*Version\/([\d\.]*)\b.*$/, "Safari $1"]
  ];

  for (i in regexes) {
    var match = regexes[i][0].exec(ua);
    if (match) {
      return ua.replace(regexes[i][0], regexes[i][1]);
    }
  }
  return ua;
}

function getOS() {
  var ua = navigator.userAgent;

  var regexes = [
    [/^.*Mac OS X (\d+)_(\d+)_(\d+).*$/g, "macOS $1.$2.$3"], // OSX Chrome, OSX Safari, OSX Opera
    [/^.*Mac OS X (\d+)_(\d+).*$/g, "macOS $1.$2"], // Just in case?
    [/^.*Mac OS X (\d+)\.(\d+).*$/g, "macOS $1.$2"], // OSX Firefox
    [/^.*iPhone OS (\d+)_(\d+).*OPiOS.*$/g, null], // iPhone Opera doesn't seem to pick up the OS dynamically?
    [/^.*iPhone OS (\d+)_(\d+).*$/g, "iOS $1.$2 (iPhone)"], // iPhone WebKit
    [/^.*iPad.*OS (\d+)_(\d+).*$/g, "iOS $1.$2 (iPad)"], // iPad WebKit
    [/^.*Android (\d+(\.\d+)+).*; ([^;]+) Build.*$/g, "Android $1 ($3)"], // Android + device name
    [/^.*Android (\d+(\.\d+)+).*$/g, "Android $1"],
    [/^.*Linux.*$/g, "Linux"],
    [/^.*Windows NT (\d+)\.(\d+).*$/g, "Windows $1.$2"],
    [/^.*Windows.*$/g, "Windows"],
  ];

  for (i in regexes) {
    var match = regexes[i][0].exec(ua);
    if (match) {
      if (!regexes[i][1]) {
        return null;
      }
      return ua.replace(regexes[i][0], regexes[i][1]);
    }
  }
  return null;
}

// A simple function to copy a string to clipboard. See https://github.com/lgarron/clipboard.js for a full solution.
var copyToClipboard = (function() {
  var _dataString = null;
  document.addEventListener("copy", function(e){
    if (_dataString !== null) {
      try {
        e.clipboardData.setData("text/plain", _dataString);
        e.preventDefault();
      } finally {
        _dataString = null;
      }
    }
  });
  return function(data, callback) {
    _dataString = data;
    document.execCommand("copy");
    callback();
  };
})();

var $ = document.querySelector.bind(document);

// Workaround for Safari 10 (https://bugs.webkit.org/show_bug.cgi?id=156529).
// When the user is copying the browser info, they presumably don't need to
// keep any other selection (it would be cleared anyhow, if they used a
// (click), so we do the easy thing and unconditionally change the selection.
var selectSomething = function() {
    var sel = window.getSelection();
    console.log(sel.toString());
    sel.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents($("#browser-info #click-to-copy"));
    sel.addRange(range);
}

window.addEventListener("load", function() {
  var ua = getBrowserVersion();
  var os = getOS();

  $("#ua").title = navigator.userAgent;
  $("#ua").textContent = ua;
  if (getOS()) {
    $("#os").textContent = os;
  }

  var clickToCopy = $("#browser-info #click-to-copy");
  var originalCopyText = clickToCopy.textContent;
  var resetClickToCopy = function() {
    clickToCopy.textContent = originalCopyText;
  };
  var copied = function() {
      clickToCopy.textContent = "Copied!";
      clearTimeout(resetClickToCopy);
      setTimeout(resetClickToCopy, 2000);
  };

  $("#browser-info").addEventListener("click", function(){
    selectSomething();
    copyToClipboard(ua + "\n" + os, copied);
  });
})