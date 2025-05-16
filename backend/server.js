// ------------------ SETUP AND INSTALL ----------------- //


require("dotenv").config();
const { GoogleAuth } = require('google-auth-library');
const express = require("express");
const app = express();
const cors = require("cors");

// --------------------- MIDDLEWARES -------------------- //

const morgan = require("morgan");

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
app.use(morgan("dev"));

// ---------------------- FUNCTIONS --------------------- //


async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: './secrets/serviceKey.json',
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token;
}
// --------------------- ENTRYPOINT --------------------- //

async function main() {
  

  const tokenGet = await getAccessToken();
  console.log(tokenGet);
}

main();