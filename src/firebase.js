// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

//  Air Quality Project
const airQualityConfig = {
  apiKey: "AIzaSyAkGEpw9l5uWdYsjW66YYIImKxGwV_jARY",
  authDomain: "air-quality-monitoring-30fe9.firebaseapp.com",
  projectId: "air-quality-monitoring-30fe9",
  storageBucket: "air-quality-monitoring-30fe9.appspot.com",
  messagingSenderId: "272718998139",
  appId: "1:272718998139:web:70ac0918c609051aaa90de"
};

//  Light Control Project (replace with your actual config)
const lightControlConfig = {
  apiKey: "AIzaSyDUEogUOw3BFPYzLheks5njNeBAJENuJjU",
  authDomain: "light-control-9192b.firebaseapp.com",
  projectId: "light-control-9192b",
  storageBucket: "air-quality-monitoring-30fe9.appspot.com",
  messagingSenderId: "948019516872",
  appId: "1:948019516872:web:5e79ae98e14c8451de5cfd"
};

// Initialize both apps with unique names
const airQualityApp = initializeApp(airQualityConfig, "AirQualityApp");
const lightControlApp = initializeApp(lightControlConfig, "LightControlApp");

// Export services for each project
const airQualityDB = getFirestore(airQualityApp);
const airQualityStorage = getStorage(airQualityApp);
const airQualityRealtime = getDatabase(airQualityApp);

const lightControlDB = getFirestore(lightControlApp);
const lightControlStorage = getStorage(lightControlApp);
const lightControlRealtime = getDatabase(lightControlApp);

export {
  airQualityApp,
  airQualityDB,
  airQualityStorage,
  airQualityRealtime,
  lightControlApp,
  lightControlDB,
  lightControlStorage,
  lightControlRealtime
};