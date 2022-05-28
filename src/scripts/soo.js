const imgContainer = document.getElementsByClassName("img-container")
const data = require('../scripts/soo.json');
const canvas = document.querySelector("#img-canvas")

var slider = document.getElementById("slider").oninput = function () {
    var ind = document.getElementById("slider").value

    var path = "Soo_" + ind + ".jpg"
    document.getElementById("img-canvas").src = path
    var jsonind = "ind_" + ind
    var fitness = data[jsonind]
    document.getElementById("ind").textContent = "Individum " + ind + "/ Fitness* = " + fitness

}
