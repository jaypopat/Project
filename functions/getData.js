/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const {initializeApp, applicationDefault} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {onRequest} = require("firebase-functions/v2/https");
const cors = require("cors");

initializeApp({
  credential: applicationDefault(),
});

// Set up CORS options to accept requests from your domain only
const corsHandler = cors({
  origin: "https://whisper-2f40a.web.app",
  methods: "GET,PUT,POST,OPTIONS",
  allowedHeaders: "*", // You might want to specify allowed headers for better security
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

const getDataByDocument = onRequest({
  cors: {
    origin: true,
    methods: ["GET", "PUT", "POST", "OPTIONS"],
  },
}, (request, response) => {
  // Handle the preflight OPTIONS request
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Origin", "https://whisper-2f40a.web.app");
    response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");
    response.status(204).send(""); // No Content for OPTIONS
    return;
  }

  // Wrap your existing logic with the cors middleware
  corsHandler(request, response, async () => {
    // Inside this function, CORS is handled with your specific domain
    if (request.method !== "GET") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const collection = request.body.collection;
    const document = request.body.document;
    const db = getFirestore();
    const item = db.collection(collection).doc(document);
    const doc = await item.get();
    if (!doc.exists) {
      console.log("No such document!");
      response.status(404).send("No such document!");
    } else {
      console.log("Document data:", doc.data());
      response.status(200).send(doc.data());
    }
  });
});

const getDataByCollection = onRequest({
  cors: {
    origin: true,
    methods: ["GET", "PUT", "POST", "OPTIONS"],
  },
}, (request, response) => {
  // Handle the preflight OPTIONS request
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Origin", "https://whisper-2f40a.web.app");
    response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");
    response.status(204).send(""); // No Content for OPTIONS
    return;
  }

  // Wrap your existing logic with the cors middleware
  corsHandler(request, response, async () => {
    // Inside this function, CORS is handled with your specific domain
    if (request.method !== "GET") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const collectionIndicator = request.body.collection;
    const db = getFirestore();
    const collection = db.collection(collectionIndicator);
    const snapshot = await collection.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      response.status(404).send("No matching documents.");
    } else {
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
      response.status(200).send(snapshot);
    }
  });
});


exports.getDataByDocument = getDataByDocument;
exports.getDataByCollection = getDataByCollection;
