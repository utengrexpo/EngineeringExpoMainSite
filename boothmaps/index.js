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

window.addEventListener("load", function () {
  const mapElement = document.querySelector('map[name="image-map"]');
  fetch("/boothmaps/boothCoordinates.json")
    .then((response) => response.json())
    .then((data) => {
      for (const boothNumber in data) {
        if (data.hasOwnProperty(boothNumber)) {
          const coordinates = data[boothNumber];
          const newArea = document.createElement("area");
          newArea.setAttribute("shape", "rect");
          newArea.setAttribute("coords", coordinates);
          newArea.setAttribute("href", `${boothNumber}`);
          newArea.setAttribute("alt", `Booth #${boothNumber}`);

          mapElement.appendChild(newArea);
        }
      }
    })
    .catch((error) => {
      console.error("Error reading in booth coordinates:", error);
    });
});

const slider = document.getElementById("myZoom");
slider.addEventListener("input", function () {
  const sliderValue = this.value;
  document.documentElement.style.setProperty("--slider-value", sliderValue);
});
