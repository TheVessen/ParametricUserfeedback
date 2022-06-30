import {
    initializeApp
} from "firebase/app";
import {
    getDatabase,
    ref,
    set,
    push
} from "firebase/database"



const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.storageBucketmessagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();


const submit = document.getElementById("submit");

submit.addEventListener("click", function (e) {
    
    e.preventDefault();
    const reference = ref(db, "Varianten")
    var vari = document.getElementById("ind").innerHTML
    vari = vari.slice(15)
    var datas = {
        variante: vari
    }

    function write(datas) {
        push(reference, datas);
    };

    if (vari.length <= 2){
        write(datas)
        window.setTimeout(() => {
            window.location.href = '../html/thanks-mmo.html';
        }, 500);
    } else{
        alert("Bewege den Slider, um eine generierte Variante zu selektieren")
    }
    
})