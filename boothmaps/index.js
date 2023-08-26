
// scroll to center on load
window.addEventListener("load", function () {
  let container = document.getElementById("scrollableMapContainer");
  let image = document.querySelector(".split.left img");
  let centerX = (image.width - container.offsetWidth) / 2;
  let centerY = (image.height - container.offsetHeight) / 2;

  // Scroll the container to the center
  container.scrollTop = centerY;
  container.scrollLeft = centerX;
});

const slider = document.getElementById("myZoom");
slider.addEventListener("input", function () {
  const sliderValue = this.value;
  document.documentElement.style.setProperty("--slider-value", sliderValue);
});
