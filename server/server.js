const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: REACT_APP_CLIENT_ID,
    clientSecret: REACT_APP_CLIENT_SECRET,
  });

  console.log(code);

  app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "http://localhost:3000",
      clientId: REACT_APP_CLIENT_ID,
      clientSecret: REACT_APP_CLIENT_SECRET,
      refreshToken,
    });
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log(data.body);
    })
    .catch((err) => {
      console.log("Could not refresh access token", err);
      res.sendStatus(400);
    });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.listen(3001);
