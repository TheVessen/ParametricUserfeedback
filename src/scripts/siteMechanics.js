//Suhbmit Data
const infoContainer = document.querySelector("#infoContainer");
const toggleMenue = document.querySelector("#toggleMenue");

toggleMenue?.addEventListener("click", () => {
  infoContainer?.classList.toggle("move");
  infoContainer?.classList.toggle("scroll-lock");
});



const fs = require('fs');
