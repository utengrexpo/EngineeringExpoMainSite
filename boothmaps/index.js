// const highlight = document.getElementById("highlight");

// const areas = document.querySelectorAll("area");
// areas.forEach((area) => {
//   area.addEventListener("mouseenter", function () {
//     const coords = this.coords.split(",").map((coord) => parseInt(coord));
//     highlight.style.width = coords[2] - coords[0] + "px";
//     highlight.style.height = coords[3] - coords[1] + "px";
//     highlight.style.left = coords[0] + "px";
//     highlight.style.top = coords[1] + "px";
//     highlight.style.display = "block";
//   });

//   area.addEventListener("mouseleave", function () {
//     highlight.style.display = "none";
//   });
// });

window.addEventListener("load", function () {
  var container = document.getElementById("scrollable_map_cont");
  var image = document.querySelector(".split.left img");
  var centerX = (image.width - container.offsetWidth) / 2;
  var centerY = (image.height - container.offsetHeight) / 2;

  // Scroll the container to the center
  console.log(image.width);
  console.log(image.height);
  console.log(centerX, centerY);
  container.scrollTop = centerY;
  container.scrollLeft = centerX;
});
