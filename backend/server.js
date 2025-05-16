const { GoogleAuth } = require('google-auth-library');
const express = require("express");
const app = express();
const cors = require("cors");

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