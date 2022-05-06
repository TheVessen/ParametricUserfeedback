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

  var shapediverTicket = "893be9b4de753bb224f45f94ee191d0fd254954318b4b4f0fcdc1e4ba03d1787c6cb3f8b258e099a132e459e3f78e7f81813c38235d21db28742f41bd3106e732739e1d4721955f708a25e4b7f99cd02a7e7eaf6191fbf5d3e7f3e0b89395d4851276d79a0fe3e-98483e11d267beb8b6159cee668dc81c";
  
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

  // Get the Median Value
  function median(numbers) {
    //get the middle value
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

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
        //Here i have all the values in an array
        if (valueList[0] == "Float") {
          valueList.shift();
          //Get median value Float
          valueList = Math.round((median(valueList)) * 10) / 10
        } else if (valueList[0] == "Int") {
          valueList.shift();
          //Get median value Int
          valueList = parseInt((median(valueList)));
        } else if (valueList[0] == "StringList") {
          valueList.shift();
          const count = {};
          //Get the most selected Option
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
    //Get Data from Database
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