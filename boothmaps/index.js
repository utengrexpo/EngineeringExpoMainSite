const mapImage = document.getElementById("mapimage");
const imageWidth = mapImage.naturalWidth;
const imageHeight = mapImage.naturalHeight;
const imageCenterX = imageWidth / 2;
const imageCenterY = imageHeight / 2;
const highlight = document.getElementById("highlight");

function scrollToCenter() {
  const container = document.getElementById("scrollableMapContainer");
  const image = document.querySelector(".split.left img");
  const centerX = (image.width - container.offsetWidth) / 2;
  const centerY = (image.height - container.offsetHeight) / 2;

  // Scroll the container to the center
  container.scrollTop = centerY;
  container.scrollLeft = centerX;
  document.documentElement.style.setProperty("--map-zoom", 0.2);
}
// scroll to center on load
window.addEventListener("load", function () {
  scrollToCenter();
});

function updateAreaAttributes(newArea, coordinates, boothNumber) {
  newArea.setAttribute("shape", "rect");
  newArea.setAttribute("coords", coordinates);
  newArea.setAttribute("href", `${boothNumber}`);
  newArea.setAttribute("alt", `Booth #${boothNumber}`);
}

function alignHiglightToArea(areaTargeting, highlightAligning) {
  scaling = getComputedStyle(document.documentElement).getPropertyValue(
    "--map-zoom"
  );
  let coords = areaTargeting.coords.split(",").map((coord) => parseInt(coord));

  highlightAligning.style.width = (coords[2] - coords[0]) * scaling + "px";
  highlightAligning.style.height = (coords[3] - coords[1]) * scaling + "px";

  let currentHorizontalOffset = coords[0] - imageCenterX;
  let currentVerticalOffset = coords[1] - imageCenterY;

  currentHorizontalOffset *= scaling;
  currentVerticalOffset *= scaling;

  let updatedOffsetHorizontal = imageCenterX + currentHorizontalOffset;
  let updatedOffsetVertical = imageCenterY + currentVerticalOffset;

  highlightAligning.style.left = updatedOffsetHorizontal + "px";
  highlightAligning.style.top = updatedOffsetVertical + "px";
  highlightAligning.style.display = "block";
}

function addBoothHoverListeners(newArea) {
  newArea.addEventListener("mouseenter", () => {
    alignHiglightToArea(newArea, highlight);
  });

  newArea.addEventListener("mouseleave", function () {
    // highlight.style.display = "none";
  });
}

// pull in location info for all of the booths
window.addEventListener("load", function () {
  const mapElement = document.querySelector('map[name="image-map"]');
  // read in json
  fetch("/boothmaps/boothCoordinates.json")
    .then((response) => response.json())
    .then((data) => {
      // for every booth
      for (const boothNumber in data) {
        if (data.hasOwnProperty(boothNumber)) {
          const coordinates = data[boothNumber];
          // make an area for our image map
          const newArea = document.createElement("area");
          updateAreaAttributes(newArea, coordinates, boothNumber);
          addBoothHoverListeners(newArea);
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
  highlight.style.display = "none";
  const sliderValue = this.value;
  document.documentElement.style.setProperty("--map-zoom", sliderValue);
});
