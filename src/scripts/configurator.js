import {
    api,
    EVENTTYPE
} from "@shapediver/viewer";

import {
    initializeApp
} from "firebase/app";
import {
    getDatabase,
    ref,
    set,
    push
} from "firebase/database"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDWH9hQgvCs8sNilPPqFv4J2tlbs62tgjw",
    authDomain: "designcolab-1917d.firebaseapp.com",
    databaseURL: "https://designcolab-1917d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "designcolab-1917d",
    storageBucket: "designcolab-1917d.appspot.com",
    messagingSenderId: "929002738141",
    appId: "1:929002738141:web:60deb9e461a512782ca634",
    measurementId: "G-C0Y34DJ5MK"
};

(async () => {
    // create a viewer
    const viewer = await api.createViewer({
        canvas: document.getElementById("canvasConfig"),
        id: "myViewerIndex",
    });
    // create a session
    const session = await api.createSession({
        ticket: "893be9b4de753bb224f45f94ee191d0fd254954318b4b4f0fcdc1e4ba03d1787c6cb3f8b258e099a132e459e3f78e7f81813c38235d21db28742f41bd3106e732739e1d4721955f708a25e4b7f99cd02a7e7eaf6191fbf5d3e7f3e0b89395d4851276d79a0fe3e-98483e11d267beb8b6159cee668dc81c",
        modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
        id: "mySessionIndex",
    });

    //Get all parameter from the GH file
    const parameters = session.parameters;

    //Here the parameter key will be stored to call each of them
    var parameterKey = [];
    var oderKey = []

    //getting the key for all parameters
    for (var key in parameters) {
        if (Object.prototype.hasOwnProperty.call(parameters, key)) {
            parameterKey.push(key);
        }
    }

    //Get parameter keys
    for (let i = 0; i < parameterKey.length; i++) {
        let param = parameters[parameterKey[i]];
        oderKey.push(param.order)
    }

    //1) combine the arrays:
    var list = [];
    for (var j = 0; j < oderKey.length; j++)
        list.push({
            'oderKey': oderKey[j],
            'parameterKey': parameterKey[j]
        });

    //2) sort:
    list.sort(function (a, b) {
        return ((a.oderKey < b.oderKey) ? -1 : ((a.oderKey == b.oderKey) ? 0 : 1));
        //Sort could be modified to, for example, sort on the age
        // if the name is the same.
    });

    //3) separate them back out:
    for (var k = 0; k < list.length; k++) {
        oderKey[k] = list[k].oderKey;
        parameterKey[k] = list[k].parameterKey;
    }

    var groupList = []
    //Go through all parameters and evaluate them
    for (let i = 0; i < parameterKey.length; i++) {
        //Selecting each of the parameters
        let param = parameters[parameterKey[i]];
        var groupName = param.group.name
        if (groupList.length == 0){
            //Create divider for HTML
            const paramcont = document.getElementById("parameterContainer");
            const labelParams = document.createElement("div");
            const t = document.createElement("h3")
            const text = document.createTextNode(groupName)
            t.appendChild(text)
            labelParams.appendChild(t)
            groupList.push(groupName)
            paramcont.appendChild(labelParams)
        } else{
            if (groupList.includes(groupName)){
                ;
            } else{
                const paramcont = document.getElementById("parameterContainer");
                const divider = document.createElement("div");
                const labelParams = document.createElement("div");
                const t = document.createElement("h3")
                const text = document.createTextNode(groupName)
                t.appendChild(text)
                labelParams.appendChild(t)
                groupList.push(groupName)
                //Add label
                divider.setAttribute("class", "divider")
                paramcont.appendChild(divider)
                groupList.push(groupName)
                paramcont.appendChild(labelParams)
            }
        };

        //Later will be the HTML element
        let paramInput = undefined;

        //Will get the resondinng HTML lable
        let label = document.createElement("label");
        label.setAttribute("for", param.id);
        label.textContent = param.name;

        //checking for the type and creating the responding HTML element
        //Check if slider
        if (
            param.type == "Int" ||
            param.type == "Float" ||
            param.type == "Even" ||
            param.type == "Odd"
        ) {
            paramInput = document.createElement("input");
            paramInput.setAttribute("id", param.id);
            paramInput.setAttribute("type", "range");
            paramInput.setAttribute("min", param.min);
            paramInput.setAttribute("max", param.max);
            paramInput.setAttribute("value", param.value);

            //Set the slider step size
            if (param.type == "Int") {
                paramInput.setAttribute("step", 1);
            } else if (param.type == "Even" || param.type == "Odd") {
                paramInput.setAttribute("step", 2);
            } else if (param.type == "Float") {
                paramInput.setAttribute("step", 0.01);
            }
            //Check if color
        } else if (param.type == "Color") {
            paramInput = document.createElement("input");
            paramInput.setAttribute("id", param.id);
            paramInput.setAttribute("type", "color");
            //Check if stringlist
        } else if (param.type == "StringList") {
            paramInput = document.createElement("select");
            paramInput.setAttribute("id", param.id);
            for (let j = 0; j < param.choices.length; j++) {
                let option = document.createElement("option");
                option.setAttribute("value", j);
                option.setAttribute("name", param.choices[j]);
                option.textContent = param.choices[j];
                if (param.value == j) option.setAttribute("selected", "");
                paramInput.appendChild(option);
            }
            //Check if string
        } else if (param.type == "String") {
            paramInput = document.createElement("input");
            paramInput.setAttribute("id", param.id);
            paramInput.setAttribute("type", "text");
            paramInput.setAttribute("value", param.value);
            //Check if bool
        } else if (param.type == "Bool") {
            paramInput = document.createElement("input");
            paramInput.setAttribute("id", param.id);
            paramInput.setAttribute("type", "checkbox");
            paramInput.setAttribute("checked", param.value);
        }

        // commit parameters and send responde update
        paramInput.onchange = function () {
            param.value = this.value;
            session.commitParameters;
            session.customize();
        };

        //Add to HTML
        const paramcont = document.getElementById("parameterContainer");
        const paramcontainer = document.createElement("div");
        paramcontainer.setAttribute("class", "params");
        paramcontainer.appendChild(label);
        paramcontainer.appendChild(paramInput);
        paramcont.appendChild(paramcontainer);
    }

    //Get Outputs

    var sessionOutput = session.outputs;
    var sesstionOutKeys = [];

    //getting the key for all outputs
    for (var key in sessionOutput) {
        if (Object.prototype.hasOwnProperty.call(sessionOutput, key)) {
            sesstionOutKeys.push(key);
        }
    }


    //get Session outputs and display
    for (let i = 0; i < sesstionOutKeys.length; i++) {
        var outs = sessionOutput[sesstionOutKeys[i]].content[0];
        var outData = undefined;
        var outsLabel = undefined;
        if (typeof outs != "undefined") {
            if (outs.format == "data") {
                //Round output
                const statusVal = Math.round(outs.data * 100) / 100;
                outsLabel = document.createTextNode(outs.name.toString());
                const label = document.createElement("p");
                label.setAttribute("class", "label");
                label.appendChild(outsLabel);
                //Create Lable Content
                const infoContent = document.getElementById("infoContentContainer");
                const lableContainer = document.createElement("div");
                lableContainer.appendChild(label);
                infoContent.appendChild(lableContainer);
                const data = document.createElement("p");
                const dataCont = document.createElement("div");
                dataCont.setAttribute("class", "data")
                const dataStatus = document.createElement("div");
                dataStatus.setAttribute("id", outs.name)
                dataStatus.setAttribute("class", "status")
                dataStatus.style.width = statusVal*100 + "%";
                dataCont.appendChild(dataStatus)
                infoContent.appendChild(dataCont)
            }
        }
    }
    
    
    // Update;
    api.addListener(EVENTTYPE.SESSION.SESSION_CUSTOMIZED, (e) => {
        console.log(e);
        
        var sessionOutputUpdate = session.outputs;
        var sesstionOutKeysUpdate = [];
        
        //getting the key for all outputs
        for (var key in sessionOutputUpdate) {
            if (Object.prototype.hasOwnProperty.call(sessionOutputUpdate, key)) {
                sesstionOutKeysUpdate.push(key);
            }
        }
        
        for (let i = 0; i < sesstionOutKeys.length; i++) {
            var outs = sessionOutputUpdate[sesstionOutKeysUpdate[i]].content[0];
            if (typeof outs != "undefined") {
                if (outs.format == "data") {
                    data = outs.data*100
                    var data = Math.round(data);
                    //Rounding outputs
                    var element = document.getElementById(outs.name)
                    element.style.width = data + "%"

                }
            }
        }
        var pams = session.parameters
        return pams
    });
    const submit = document.getElementById("submit");
    //Parameters to submit to DB
    const Dbparameters = [];
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();

    //Submit Data
    submit.addEventListener("click", function (e) {
        e.preventDefault();
        const reference = ref(db, session.ticket)
        var datas = {}
        var dataval = []
        for (let i = 0; i < parameterKey.length; i++) {
            //Selecting each of the parameters
            let param = parameters[parameterKey[i]];
            var id = param.id;
            var name = param.name;
            var type = param.type;
            var value = param.value;
        
            id = name.replace(" ", "");
            datas[id] = value
        
        }
        function write(datas) {
            push(reference, datas);
        };
        write(datas)
        window.setTimeout(() => {window.location.href = '../html/thankyou.html'; }, 500);
    });
})();



