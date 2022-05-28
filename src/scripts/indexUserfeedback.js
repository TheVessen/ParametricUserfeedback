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

  var shapediverTicket = process.env.ShapediverKey;
  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  //Replace the "process.env...." with your own API 
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
    api.addListener(EVENTTYPE.SESSION.SESSION_CUSTOMIZED, (e) => {
      console.log(e);
    });
  
    await session.customize();
  })();


