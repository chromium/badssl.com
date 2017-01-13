
function youtubeAutoplay() {
  var iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube.com/embed/t1SZs4xudf8?autoplay=1";
  iframe.width = 0;
  iframe.height = 0;
  iframe.setAttribute("frameborder", 0);
  document.body.appendChild(iframe);
}

var funky = false;
window.addEventListener("load", function() {
  var defunct = document.getElementById("defunct");
  defunct.classList.add("hover-link");
  defunct.addEventListener("click", function() {
    if (funky) {
      return;
    }
    funky = true;
    youtubeAutoplay();
    defunct.textContent = "💿 deFUNKt 🎶";
    defunct.classList.remove("hover-link");
    document.body.classList.add("funky");
    defunct.parentElement.classList.add("funky");
  });
});
