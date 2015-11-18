(function() {
  // Change the background to red
  document.querySelector("html").style.backgroundColor = "red";
  document.querySelector("body").style.backgroundColor = "red";

  // Write text to the page
  document.getElementById("footer").innerHTML = "This page has run active mixed content<br>(a script from an insecure URL).";
})();
