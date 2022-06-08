const btn = document.querySelector("#info-toggle")
const sidebar = document.querySelector(".sidebar")
const extraInfo = document.querySelector(".extra-info")
const unfixed = document.querySelector(".unfixed")
const content = document.querySelector(".u-content")
const scrollContainer = document.querySelector("body");


btn.addEventListener("click", function () {
    sidebar.classList.toggle("slide-left")
    extraInfo.classList.toggle("expand")
    unfixed.classList.toggle("show")
    content.classList.toggle("show2")

    if (btn.innerHTML === "Aufbau Algorithmus") {
        btn.textContent = "Zurück"
    } else {
        btn.textContent = "Aufbau Algorithmus"
    }
})


var pos = 0;

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    var scroll = evt.deltaY
    pos += (scroll *-1) / 100 *2
    if (pos > 0) {
        pos = 0
    } else if( pos < -80){
        pos = -80
    }
    document.querySelector(".unfixed").style.transform = "translate(" + pos + "%, 0%)"
}, { passive: false });

