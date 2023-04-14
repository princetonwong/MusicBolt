/* Load the Express library */
const express = require("express");
const mongoose = require("mongoose");
var request = require('request');
var querystring = require('querystring');
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const spotifyRoutes = require("./routes/spotify");


/*--------------------------------Create an HTTP server to handle responses--------------------------------*/
// Connect to MongoDB
mongoose
	.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log("MongoDB connected..."))
	.catch(err => console.log(err));

const app = express();

// Init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Logger
app.use("/", (req, res, next) => {
	console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
	next();
});

// Routes:
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", spotifyRoutes);


// Listen to req
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running at Port ${PORT}`);
	authSpotifyApi();
});



const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
access_token='';

function authSpotifyApi() {
	access_token = 'BQDJ0t7quvbpEWUQQ6xn7GZooN_7Ouvrt1PyfvcCf7RdQH4aVh4GaLO6qb81ZyUlmV13C1hIDiMLABDe7ok4igScRWIuwPwYR2uB8c91ELarqBA9bKtD-zzaaSZ3EW1_ZCGRKPbENle7SqvrfSIrh2Z3RVlQXh9SarIkVd6cDO-yE6oChlhCCxC2kNXGLdjYO4D_k4YQR4hdOGqKuDpsXZCyq1BrWVoInTQE3VjxcisqksMIeQnaL9YTBz4v_h7Ea_4ERBXPY5Go94bVHqK7gLy5eFUfSZp6rcxoVBFQ2_7E-94QVlnXNuKIzU3rjfxErOw84nGEIop1F17QSFNhlH8brJ3z4aFi_lXlnnP09_3Scntr6rurey92p8Lg';
	/* 
		The access token expires after 1 hour. Uncomment the code below to request a new token (gets logged in the console).
		Replcae the token value with the `access_token` variable above and comment the code below again to prevent spams for 
		access token request to Spotify API if you are using hot-reload
	*/
	let options = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			grant_type: 'client_credentials'
		},
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
		}
	}
	request.post(options, (err, res, body) => {
		console.log(JSON.parse(body).access_token);
		access_token = JSON.parse(body).access_token;
	});
};