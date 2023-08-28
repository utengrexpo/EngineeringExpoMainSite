const mapImage = document.getElementById("mapimage");
const imageWidth = mapImage.naturalWidth;
const imageHeight = mapImage.naturalHeight;
const imageCenterX = imageWidth / 2;
const imageCenterY = imageHeight / 2;
const highlight1 = document.getElementById("highlight1");
const highlight2 = document.getElementById("highlight2");

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

// function scrollIntoView(element){
//   element.scrollIntoView({ behavior: "smooth"})
// }

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
    alignHiglightToArea(newArea, highlight1);
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
  highlight1.style.display = "none";
  const sliderValue = this.value;
  document.documentElement.style.setProperty("--map-zoom", sliderValue);
});

let day1EmployerData = null;
let day2EmployerData = null;

function loadJsonFile(file) {
  return fetch(file)
    .then((response) => response.json())
    .then((jsonData) => {
      return jsonData;
    });
}

async function populateEmployerData(whichDay) {
  // which Day should be either 1 or two
  if (whichDay == 1) {
    const informationFile = "/boothmaps/day1employerdata.json";
    if (day1EmployerData == null) {
      day1EmployerData = await loadJsonFile(informationFile);
    }
  } else if (whichDay == 2) {
    const informationFile = "/boothmaps/day2employerdata.json";
    if (day2EmployerData == null) {
      day2EmployerData = await loadJsonFile(informationFile);
    }
  }
}

function updateDay(whichDay) {
  populateEmployerData(whichDay).then(() => {
    // update dropdown label
    const message = `Select from Day ${whichDay} Employers`;
    const dropdownLabel = document.getElementById("employerSelectionLabel");
    dropdownLabel.innerHTML = message;

    // clear existing dropdown values
    const employerSelectionDropdown = document.getElementById(
      "employerSelectionDropdown"
    );
    employerSelectionDropdown.innerHTML = "";

    // update dropdown values
    const employerDataRelevant =
      whichDay == 1 ? day1EmployerData : day2EmployerData;
    console.log(employerDataRelevant);

    for (const employerName in employerDataRelevant) {
      if (!employerDataRelevant.hasOwnProperty(employerName)) {
        continue;
      }
      const newEmployerOption = document.createElement("option");
      newEmployerOption.setAttribute("value", employerName);
      newEmployerOption.innerHTML = employerName;
      employerSelectionDropdown.appendChild(newEmployerOption);
    }

    // clear fields for the selected employer
  });
}

window.addEventListener("load", function () {
  const whichDayButtons = document.querySelectorAll(
    'input[type="radio"][name="whichDay"]'
  );
  whichDayButtons.forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (this.checked) {
        updateDay(parseInt(this.value));
      }
    });
  });
});
