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

const putData = onRequest({
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
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const data = request.body;
    console.log("Request body: ", data);
    const db = getFirestore();
    const collection = db.collection("rooms").doc(data.chatRoomID);
    await collection.set({
      chatRoomId: data.chatRoomID,
      chatRoomName: data.chatRoomName,
      radius: data.radius,
      user: data.user.email,
    });
  });
});

exports.putData = putData;
