// ------------------ SETUP AND INSTALL ----------------- //

require("dotenv").config(); // Load environment variables from .env
const { GoogleAuth } = require("google-auth-library"); // Google Cloud authentication
const express = require("express"); // Express web server
const app = express();
const cors = require("cors"); // CORS middleware
const PORT = process.env.SERVER_LISTEN_PORT; // Port from environment
const assert = require("node:assert/strict"); // Assertion utility for debugging

// --------------------- MIDDLEWARES -------------------- //

const morgan = require("morgan"); // HTTP request logger
app.use(morgan("dev")); // Log requests to console
app.use(express.json({ limit: "10MB" })); // Parse JSON bodies up to 10MB. this is the limit for google API

// Configure CORS to allow only specific origins
const corsConfigs = {
  origin: (incomingOrigin, allowedAccess) => {
    // Allow localhost (any port) and production domain
    const allowedOrigins = [/^http:\/\/localhost:\d+$/, /^https:\/\/mission1.sethsamuel.dev/];
    // Allow requests with no origin (e.g., curl, server-to-server)
    if (!incomingOrigin || allowedOrigins.some((testOrigin) => testOrigin.test(incomingOrigin))) {
      allowedAccess(null, true); // Allow
    } else {
      allowedAccess(null, false); // Deny
    }
  },
};
app.use(cors(corsConfigs)); // Apply CORS policy

// ---------------------- FUNCTIONS --------------------- //

// Obtain a Google Cloud access token using a service account
async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: "./secrets/serviceKey.json", // Service account key file
    scopes: "https://www.googleapis.com/auth/cloud-platform", // Cloud platform scope
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token;
}

// --------------------- TRAINED API -------------------- //

// Call a custom-trained Google Vision API endpoint with a base64 image
async function getTrainedAIResults(imageBase64) {
  // Optionally check input type
  // assert.ok(typeof imageBase64 === 'string');
  const tokenUser = await getAccessToken();
  const resp = await fetch(process.env.GOOGLE_VISION_URL_TRAINED, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenUser.token}`,
      // "x-goog-user-project": `${process.env.GOOGLE_PROJECT}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      instances: [
        { content: imageBase64 },
      ],
      parameters: {
        confidenceThreshold: 0.5, // Only predictions above this confidence
        maxPredictions: 5, // Limit number of predictions
      },
    }),
  });
  const data = await resp.json();
  return data;
}

// --------------------- NORMAL API --------------------- //

// Call the standard Google Vision API for object localization
async function getPlainAIResults(imageBase64) {
  // Optionally check input type
  // assert.ok(typeof imageBase64 === 'string');
  const tokenUser = await getAccessToken();
  const resp = await fetch(process.env.GOOGLE_VISION_URL_PLAIN, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenUser.token}`,
      "x-goog-user-project": `${process.env.GOOGLE_PROJECT}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      requests: [
        {
          image: { content: imageBase64 },
          features: [
            { maxResults: 1, type: "OBJECT_LOCALIZATION" },
          ],
        },
      ],
    }),
  });
  const data = await resp.json();
  console.log(data); // Log full response for debugging
  return data;
}

// ----------------------- ROUTES ----------------------- //

// Health check/test GET endpoint
app.get("/test", (req, resp) => {
  resp.status(200).json({ status: "success", data: "youve hit /test" });
});

// Test POST endpoint to echo received data
app.post("/postTest", (req, resp) => {
  console.log(req.body);
  resp.status(200).json({ status: "success", data: req.body });
});

// Dummy endpoint for receiving and logging base64 images
app.post("/sendImageBase64", (req, resp) => {
  console.log(req.body.image);
  resp.status(200).json({ status: "success", data: "ok" });
});

// Endpoint for custom-trained model predictions
app.post("/identTrained", async (req, resp) => {
  const ident = await getTrainedAIResults(req.body.image);
  const predArray = ident.predictions[0];
  const identObject = [];
  // Build array of {tag, confidence} objects from predictions
  for (let index = 0; index < predArray.confidences.length; index++) {
    identObject.push({
      tag: `${predArray.displayNames[index]}`,
      confidence: `${predArray.confidences[index]}`,
    });
  }
  console.log(identObject); // Log predictions
  resp.status(200).json({ status: "success", data: identObject });
});

// Endpoint for standard Vision API object localization
app.post("/identPlain", async (req, resp) => {
  const ident = await getPlainAIResults(req.body.image);
  console.log(ident.responses[0]); // Log response
  resp.status(200).json({ status: "success", data: ident.responses[0] });
});

// Start the Express server
app
  .listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.log("server error !!!!", error);
  });
