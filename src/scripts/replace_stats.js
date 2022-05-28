const imgContainer = document.getElementsByClassName("img-container")
const data = require('../scripts/mmo.json');
const canvas = document.querySelector("#img-canvas")

var slider = document.getElementById("slider").oninput = function () {
    var ind = document.getElementById("slider").value

    var path = "dg_ind_." + ind + ".png"
    document.getElementById("stat-img").src = path
    document.getElementById("img-canvas").src = "Moo_" + ind + ".jpg"
    document.getElementById("ind").textContent = "Individum " + ind
    var jsonind = "ind_" + ind
    document.getElementById("sym").textContent = data[jsonind][0]
    document.getElementById("comp").textContent = data[jsonind][1]
    document.getElementById("fit").textContent = data[jsonind][2]
    document.getElementById("matUse").textContent = data[jsonind][3]

}


