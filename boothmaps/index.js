const mapImage = document.getElementById("mapimage");
const imageWidth = mapImage.naturalWidth;
const imageHeight = mapImage.naturalHeight;
const imageCenterX = imageWidth / 2;
const imageCenterY = imageHeight / 2;
const highlight1 = document.getElementById("highlight1"); // the one that the user will manipulate
const highlight2 = document.getElementById("highlight2"); // the one that will be placed by the dropdown

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


function updateAreaAttributes(newArea, coordinates, boothNumber) {
  newArea.setAttribute("shape", "rect");
  newArea.setAttribute("coords", coordinates);
  newArea.setAttribute("alt", `Booth #${boothNumber}`);
  newArea.setAttribute("boothNumber", boothNumber);
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
  highlightAligning.setAttribute(
    "boothNumber",
    areaTargeting.getAttribute("boothNumber")
  );
}

function addBoothHoverListeners(newArea) {
  newArea.addEventListener("mouseenter", () => {
    alignHiglightToArea(newArea, highlight1);
  });

  newArea.addEventListener("mouseleave", function () {
    // highlight1.style.display = "none";
  });
}

let boothNumberToAreaDict = new Object();

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
          boothNumberToAreaDict[boothNumber] = newArea;
        }
      }
    })

    .catch((error) => {
      console.error("Error reading in booth coordinates:", error);
    });

    if (!this.sessionStorage.getItem('pageReloaded')){
      this.sessionStorage.setItem("pageReloaded", "true");
      this.location.reload();
    }

  document
    .getElementById("scrollableMapContainer")
    .addEventListener("mouseleave", function () {
      highlight1.style.display = "none";
    });

  updateDay(1);

  scrollToCenter();

});

const slider = document.getElementById("myZoom");
slider.addEventListener("input", function () {
  highlight1.style.display = "none";
  highlight2.style.display = "none";
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

const boothNumberToEmployerName = new Object();

let currentDay = null;

function updateDay(whichDay) {
  currentDay = whichDay;
  highlight2.style.display = "none";
  populateEmployerData(whichDay).then(() => {
    // update dropdown label
    const message = `Select from Day ${whichDay} Employers`;
    const dropdownLabel = document.getElementById("employerSelectionLabel");
    dropdownLabel.innerHTML = message;

    // clear existing dropdown values
    const employerSelectionDropdown = document.getElementById(
      "employerSelectionDropdown"
    );

    // create default to start with
    employerSelectionDropdown.innerHTML = "";
    instruction = document.createElement("option");
    instruction.innerHTML = "Select an employer";
    employerSelectionDropdown.appendChild(instruction);

    // update dropdown values
    const employerDataRelevant =
      whichDay == 1 ? day1EmployerData : day2EmployerData;

    for (const employerName in employerDataRelevant) {
      if (!employerDataRelevant.hasOwnProperty(employerName)) {
        continue;
      }

      // add employer to list of options
      const newEmployerOption = document.createElement("option");
      newEmployerOption.setAttribute("value", employerName);
      newEmployerOption.innerHTML = employerName;
      employerSelectionDropdown.appendChild(newEmployerOption);

      // create a mapping from booth numbers to employers
      for (const boothNumber of employerDataRelevant[employerName][
        `Day ${whichDay} Booth`
      ]) {
        boothNumberToEmployerName[boothNumber] = employerName;
      }
    }

    // clear fields for the selected employer
    const employerInfoDiv = document.getElementById("employerInformationDiv");
    employerInfoDiv.style.display = "none";
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

const employerSelectionDropdown = document.getElementById(
  "employerSelectionDropdown"
);

function updateEmployerDataBasedOnDropdownSelected() {
  // find which employer was selected
  const selectedEmployer = employerSelectionDropdown.value;
  const whichDayData = currentDay == 1 ? day1EmployerData : day2EmployerData;
  const relevantEmployerData = whichDayData[selectedEmployer];

  // find the booth number
  const correctBoothRelatedKey =
    "Day 1 Booth" in relevantEmployerData ? "Day 1 Booth" : "Day 2 Booth";
  const boothNumberData = relevantEmployerData[correctBoothRelatedKey];
  const boothNumber = boothNumberData[0];

  // put the highlight on the booth, and scroll highlight into view
  alignHiglightToArea(boothNumberToAreaDict[boothNumber], highlight2);
  highlight2.scrollIntoView({
    behavior: "auto",
    block: "center",
    inline: "center",
    behavior: "smooth",
  });

  // update employer information
  const employerInfoDiv = document.getElementById("employerInformationDiv");
  employerInfoDiv.style.display = "inline-block";
  const thingsWeNeedToUpdate = {
    companyName: "Organization Name",
    boothNumbers: correctBoothRelatedKey,
    companyIndustry: "Industry",
    companyMajorsRecruited: "Majors Recruited",
    companyPositionTypesRecruited: "Position Types",
    companyDegreeLevelsRecruited: "Degree Levels Recruited",
    companySiteLink: "Website",
  };
  for (const [documentElementID, keyInEmployerData] of Object.entries(
    thingsWeNeedToUpdate
  )) {
    // need to replace "," with ", " so it looks better
    document.getElementById(documentElementID).innerHTML = String(
      relevantEmployerData[keyInEmployerData]
    ).replaceAll(",", ", ");
  }
  const companySiteLink = document.getElementById("companySiteLink");
  companySiteLink.setAttribute("href", relevantEmployerData["Website"]);
  companySiteLink.setAttribute("target", "_blank");

  // adjust the footer
  makeFooterResponsive();
}

employerSelectionDropdown.addEventListener(
  "input",
  updateEmployerDataBasedOnDropdownSelected
);

function indicateNoEmployerAssignedToBooth(boothNumber) {
  alert(`No Employer Assigned To Booth ${boothNumber}!`);
}

highlight1.addEventListener("click", function () {
  const boothNumber = highlight1.getAttribute("boothNumber");
  const employerName = boothNumberToEmployerName[boothNumber];

  // select from dropdown, so we can synchronize changes
  const employerOptionToSelect = Array.from(
    employerSelectionDropdown.options
  ).find((option) => option.value == employerName);
  if (!employerOptionToSelect) {
    indicateNoEmployerAssignedToBooth(boothNumber);
  }
  employerOptionToSelect.selected = true;
  updateEmployerDataBasedOnDropdownSelected();

  makeFooterResponsive();
});


function makeFooterResponsive(){

  var windowWidth = window.innerWidth;

  // Check the screen size based on the width
  if (windowWidth < 768) {
    
      //   // Get the element by its id
      var divFooter = document.getElementById('footer-part');

      var divElementRightAreaPanel = document.getElementById('right-area-panel');

      var divHeightRightArea = divElementRightAreaPanel.clientHeight; 
  
  
      // Set the height of the element
      divFooter.style.marginTop = divHeightRightArea + 'px';
  }
}

makeFooterResponsive()