// ------------------ SETUP AND INSTALL ----------------- //

require("dotenv").config();
const { GoogleAuth } = require("google-auth-library");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.SERVER_LISTEN_PORT;
//for error checking 
const assert = require('node:assert/strict');
// --------------------- MIDDLEWARES -------------------- //

const morgan = require("morgan");
app.use(morgan("dev"));
//set allowable size to 10MB
app.use(express.json({ limit: "10MB" }));

const corsConfigs = {
  origin: (incomingOrigin, allowedAccess) => {
    //we add regex of sites we want to allow here
    const allowedOrigins = [/^http:\/\/localhost:\d+$/];

    //some requests dont have an origin so we allow those through.
    //we scan the lists of allowed origins and if it works we allow them through
    if (!incomingOrigin || allowedOrigins.some((testOrigin) => testOrigin.test(incomingOrigin))) {
      allowedAccess(null, true);
    } else {
      allowedAccess(null, false);
    }
  },
};

app.use(cors(corsConfigs));

// ---------------------- FUNCTIONS --------------------- //

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
async function getAIResults(imageBase64) {
  //check if the correct type gets passed in
  // assert.ok( (typeof imageBase64)==String);
  const tokenUser = await getAccessToken();
  // console.log(tokenUser.token);
  // ------------------------------------------------------ //

  const resp = await fetch(process.env.GOOGLE_VISION_URL, {
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


// getAIResults();
// ----------------------- ROUTES ----------------------- //
app.get("/test", (req, resp) => {
  resp.status(200).json({ status: "success", data: "youve hit /test" });
});

app.post("/postTest", (req, resp) => {
  console.log(req.body);
  resp.status(200).json({ status: "success", data: req.body });
});

app.post("/sendImageBase64", (req, resp) => {
  console.log(req.body.image);
  resp.status(200).json({ status: "success", data: "ok" });
});

app.post("/ident",async (req, resp) => {
  // console.log("Received base64 image:", req.body.image);
  // console.log(req.body.image)
  const ident = await getAIResults(req.body.image)
  // console.log(ident.error.details[0])
  console.log(ident.responses[0])
  resp.status(200).json({ status: "success", data: ident.responses[0] });
});

app
  .listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.log("server error !!!!", error);
  });
