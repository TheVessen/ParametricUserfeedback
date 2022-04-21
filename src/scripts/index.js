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
    push,
    onValue,
    get
  } from "firebase/database"

  var shapediverTicket = "3c97709d88a4f2768a3477791134a231261629d2c30c1bf3891a9ba5ffb222a219d440398df6830735b52ea8730d25ca47a46c313f05d77c39e63fc5a35d5eb4d56b9a4735d75eb373dab6d5fa9738453574a7f1bcd5c5eee42e5688cb348fa77a15c4a221cb4d-f7e41cbaba79e6dc66a529c582d355ab";
  
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
  
  const app = initializeApp(firebaseConfig);
  const db = getDatabase();
  
  const refrence = ref(db, shapediverTicket)
  
  function convertData(parameters) {
    var keys = [];
    var processedParams = {};
    for (let i = 0; i < parameters.length; i++) {
      let currentKey = parameters[i].id;
      if (keys.includes(currentKey)) {} else {
        var valueList = [];
        valueList.push(parameters[i].type);
        for (let j = 0; j < parameters.length; j++) {
          if (currentKey == parameters[j].id) {
            var val = parameters[j].value;
            if (
              parameters[j].type == "Float" ||
              parameters[j].type == "Int" ||
              parameters[j].type == "Even" ||
              parameters[j].type == "Odd" ||
              parameters[j].type == "StringList"
            ) {
              val = Number(val);
            }
            valueList.push(val);
          } else {}
        }
        //HEre i have all the values in an array
        if (valueList[0] == "Float") {
          valueList.shift();
          var l = valueList.length;
          valueList = valueList.reduce((a, b) => a + b);
          valueList = valueList / l;
          valueList = Math.round(valueList * 10) / 10
        } else if (valueList[0] == "Int") {
          valueList.shift();
          var l = valueList.length;
          valueList = valueList.reduce((a, b) => a + b);
          valueList = parseInt(valueList / l);
        } else if (valueList[0] == "StringList") {
          valueList.shift();
          const count = {};
          valueList.forEach((element) => {
            count[element] = (count[element] || 0) + 1;
          });
          var valCount = Object.keys(count).reduce(function (a, b) {
            return count[a] > count[b] ? a : b;
          });
          valueList = String(valCount);
        } else if (valueList[0] == "Color"){
          valueList = valueList[1]
        }
  
        processedParams[currentKey] = valueList;
      }
      keys.push(currentKey);
    }
    return processedParams
  }
  
  
  (async () => {
    // create a viewer
    const viewer = await api.createViewer({
      canvas: document.getElementById("canvasIndex"),
      id: "myViewerIndex",
    });
    // create a session
    const session = await api.createSession({
      ticket: shapediverTicket ,
      modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
      id: "mySessionIndex",
    });
  
    get(refrence).then((snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val())
        const convertedData = convertData(data)
        const keys = Object.keys(convertedData)
        const values = Object.values(convertedData)
        for (let i = 0; i < keys.length; i++) {
          var param = session.getParameterById(keys[i])
          param.value = values[i]
          session.commitParameters;
          session.customize();
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    api.addListener(EVENTTYPE.SESSION.SESSION_CUSTOMIZED, (e) => {
      console.log(e);
    });
  
    await session.customize();
  })();