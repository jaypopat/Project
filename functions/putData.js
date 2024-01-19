/* eslint-disable max-len */
const {initializeApp, applicationDefault} = require("firebase-admin/app");
const {getDatabase} = require("firebase-admin/database");
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
  corsHandler(request, response, () => {
    // Inside this function, CORS is handled with your specific domain
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    // Updated logging for Gen 2
    console.log(request.body.db);
    console.log(request.body);

    const db = getDatabase();
    const ref = db.ref(request.body.db); // Make sure to use query for parameters
    ref.update(request.body, (error) => {
      if (error) {
        response.status(500).send("Data could not be updated. Error: " + error.message);
      } else {
        response.status(200).send("Data updated successfully.");
      }
    });
  });
});

exports.putData = putData;
