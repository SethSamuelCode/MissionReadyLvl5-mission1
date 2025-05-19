// ------------------ SETUP AND INSTALL ----------------- //

require("dotenv").config(); // Load environment variables from .env file
const { GoogleAuth } = require("google-auth-library"); // Google authentication library
const express = require("express"); // Express web framework
const app = express();
const cors = require("cors"); // CORS middleware
const PORT = process.env.SERVER_LISTEN_PORT; // Server port from environment
//for error checking
const assert = require("node:assert/strict"); // Node.js assertion library

// --------------------- MIDDLEWARES -------------------- //

const morgan = require("morgan"); // HTTP request logger middleware
app.use(morgan("dev")); // Use morgan for logging
//set allowable size to 10MB
app.use(express.json({ limit: "10MB" })); // Parse JSON bodies up to 10MB

// CORS configuration to allow only specific origins
const corsConfigs = {
  origin: (incomingOrigin, allowedAccess) => {
    //we add regex of sites we want to allow here
    const allowedOrigins = [/^http:\/\/localhost:\d+$/, /^https:\/\/mission1.sethsamuel.dev/];

    //some requests dont have an origin so we allow those through.
    //we scan the lists of allowed origins and if it works we allow them through
    if (!incomingOrigin || allowedOrigins.some((testOrigin) => testOrigin.test(incomingOrigin))) {
      allowedAccess(null, true); // Allow request
    } else {
      allowedAccess(null, false); // Block request
    }
  },
};

app.use(cors(corsConfigs)); // Apply CORS policy

// ---------------------- FUNCTIONS --------------------- //

// Get a Google Cloud access token using a service account key
async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: "./secrets/serviceKey.json", // Path to service account key
    scopes: "https://www.googleapis.com/auth/cloud-platform", // Required scope
  });

  const client = await auth.getClient(); // Get authenticated client
  const token = await client.getAccessToken(); // Get access token
  return token; // Return token object
}

// Call Google Vision API with a base64-encoded image and return results
async function getCustomAIResults(imageBase64) {
  //check if the correct type gets passed in
  // assert.ok( (typeof imageBase64)==String);
  const tokenUser = await getAccessToken(); // Get Google access token
  // console.log(tokenUser.token);
  // ------------------------------------------------------ //

  const resp = await fetch(process.env.GOOGLE_VISION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenUser.token}`,
      // "x-goog-user-project": `${process.env.GOOGLE_PROJECT}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      instances: [
        {
          content: imageBase64, // Image data
        },
      ],
      parameters: {
        confidenceThreshold: 0.5, // Only return predictions above this confidence
        maxPredictions: 5, // Limit number of predictions
      },
    }),
  });
  const data = await resp.json(); // Parse response JSON
  const responseObject = data;
  console.log(responseObject); // Log response
  return responseObject; // Return response
}

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: "./secrets/serviceKey.json",
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token;
}

//async function so i can await get google access token.
// the set up needs to complete before doing anything else
async function getPlainAIResults(imageBase64) {
  //check if the correct type gets passed in
  // assert.ok( (typeof imageBase64)==String);
  // console.log(imageBase64)
  const tokenUser = await getAccessToken();
  // console.log(tokenUser.token);
  // ------------------------------------------------------ //
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
          image: {
            content: imageBase64,
          },
          features: [
            {
              maxResults: 1,
              type: "OBJECT_LOCALIZATION",
            },
          ],
        },
      ],
    }),
  });
  const data = await resp.json();
  const responseObject = data;
  console.log(responseObject);
  return responseObject;
}
// --------------------- ENTRYPOINT --------------------- //

// getAIResults(); // (Unused entrypoint)
// ----------------------- ROUTES ----------------------- //

// Test GET endpoint
app.get("/test", (req, resp) => {
  resp.status(200).json({ status: "success", data: "youve hit /test" });
});

// Test POST endpoint
app.post("/postTest", (req, resp) => {
  console.log(req.body);
  resp.status(200).json({ status: "success", data: req.body });
});

// Dummy endpoint for receiving base64 images
app.post("/sendImageBase64", (req, resp) => {
  console.log(req.body.image);
  resp.status(200).json({ status: "success", data: "ok" });
});

// Main endpoint for image identification using Google Vision API
app.post("/ident", async (req, resp) => {
  // console.log("Received base64 image:", req.body.image);
  // console.log(req.body.image)
  const ident = await getAIResults(req.body.image); // Get AI results for image
  // console.log(ident.error.details[0])
  const predArray = ident.predictions; // Extract predictions
  
  console.log(predArray); // Log predictions
  resp.status(200).json({ status: "success", data: ident.responses[0] }); // Respond with first response
});

app.post("/identPlain", async (req, resp) => {
  // console.log("Received base64 image:", req.body.image);
  // console.log(req.body.image)
  const ident = await getPlainAIResults(req.body.image)
  // console.log(ident.error.details[0])
  console.log(ident.responses[0])
  resp.status(200).json({ status: "success", data: ident.responses[0] });
});



// Start the Express server and listen for requests
app
  .listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.log("server error !!!!", error);
  });
