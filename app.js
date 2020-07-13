const express = require("express");
const app = express();
const axios = require("axios");
const Artist = require("./Artist").Artist;
const User = require("./Artist").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var path = require('path');

// cookie parser
var cookieParser = require("cookie-parser");
app.use(cookieParser());

//calling API
//localhost:5000/getArtist?artist_search=artistName
app.get("/getArtist", (req, res) => {
	const artist_search =
		req.query.artist_search == "" ? "smith" : req.query.artist_search;

	const order = req.query.order;

	const querystr = `https://api.deezer.com/search/artist?q=${artist_search}&order=${order}`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getArtistTopTrack?artist_id=artistID
app.get("/getArtistTopTrack", (req, res) => {
	const artist_id = req.query.artist_id;

	const querystr = `https://api.deezer.com/artist/${artist_id}/top`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getArtistTopTrack?artist_id=artistID
app.get("/getArtistRelatedNews", (req, res) => {
	const artist_name = req.query.artist_name;
	const sortBy = req.query.sortBy;
	const language = req.query.language;
	const apikey_news = "fbeba8d45b5c49e88f83dbb9b40cbe48";

	const querystr = `https://newsapi.org/v2/everything?q="${artist_name}"&apiKey=${apikey_news}&sortBy=${sortBy}&language=${language}`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/saveArtist?artist_id=artistID
app.get("/saveArtist", (req, res) => {
	const artist_id = req.query.artist_id;

	const querystr = `https://api.deezer.com/artist/${artist_id}`;

	axios
		.get(querystr)
		.then((response) => {
			const artist = new Artist({
				ID: response.data.id,
				Name: response.data.name,
				PictureURL: response.data.picture_medium,
				AlbumNum: response.data.nb_album,
				FansNum: response.data.nb_fan,
				UserID: req.cookies["uid"],
			});

			artist
				.save()
				.then((response) => {
					res.send(response.data);
				})
				.catch((error) => {
					res.status(400).json(error);
				});
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getAllArtist
app.get("/getAllArtist", (req, res) => {
	Artist.find({ UserID: req.cookies["uid"] })
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getSameArtist
app.get("/getSameArtist", (req, res) => {
	Artist.findOne({ ID: req.query.artist_id, UserID: req.cookies["uid"] })
		.then((response) => {
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
			// res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/deleteArtist?title=MovieTitle
app.get("/deleteArtist", (req, res) => {
	Artist.deleteOne({ ID: req.query.artist_id })
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

//localhost:5000/getSameEmail
app.get("/getSameEmail", (req, res) => {
	User.findOne({ email: req.query.email })
		.then((response) => {
			console.log(response);
			if (response) {
				res.send(true);
			} else {
				res.send(false);
			}
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//localhost:5000/register
app.post("/register", async (req, res) => {
	// hash password
	const salt = await bcrypt.genSalt(10);
	const hashPsw = await bcrypt.hash(req.body.user.psw, salt);

	const user = new User({
		name: req.body.user.name,
		email: req.body.user.email,
		password: hashPsw,
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).json(error);
	}
});

//localhost:5000/login
app.post("/login", async (req, res) => {
	// check if email exist
	const user = await User.findOne({ email: req.body.user.email });
	if (!user) {
		return res.send(false);
	}

	// check if password correct
	const validPsw = await bcrypt.compare(req.body.user.psw, user.password);
	if (!validPsw) {
		return res.send(false);
	}

	// create and assign a token
	const token = jwt.sign({ _id: user._id }, "vE7YWqEuJQOXjlKxU7e4SOl");

	// save token and user id to cookie
	res.cookie("auth-token", token);
	res.cookie("uid", user._id);
	res.cookie("uname", user.name);
	res.send(true);
});

app.post("/logout", async (req, res) => {
	// clear auth-token cookie and user id cookie
	res.clearCookie("auth-token").clearCookie("uid").clearCookie("uname").send(true);
});

app.get("/verifyToken", (req, res) => {
	const token = req.cookies["auth-token"];
	console.log(req.cookies["uid"]);
	if (!token) {
		console.log("Access Denied");
		return res.send("Access Denied");
		// return res.redirect('/');
	}
	try {
		const verified = jwt.verify(token, "vE7YWqEuJQOXjlKxU7e4SOl");
		req.user = verified;
		return res.send("Access Granted");
		// next(); // continue to next middleware
	} catch (err) {
		console.log("Invalid token");
		return res.send("Invalid token");
	}
});

// heroku
if (process.env.NODE_ENV === "production") {
	// Exprees will serve up production assets
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
