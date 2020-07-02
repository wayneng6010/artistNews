const express = require("express");
const app = express();
const axios = require("axios");
const Artist = require("./Artist");
// const News = require("./Artist").News;

//api key
// const apikey_news = "fbeba8d45b5c49e88f83dbb9b40cbe48";

//calling API

//localhost:5000/getArtist?artist_search=artistName
app.get("/getArtist", (req, res) => {
	
	const artist_search = req.query.artist_search == '' ? 'smith' : req.query.artist_search;

	const querystr = `https://api.deezer.com/search/artist?q=${artist_search}`;

	axios
		.get(querystr)
		.then((response) => {
			
			// const artist = new Artist({
			// 	ID: response.data.data[0].id,
			// 	Name: response.data.data[0].name,
			// 	PictureURL: response.data.data[0].picture_medium,
			// 	AlbumNum: response.data.data[0].nb_album,
			// 	FansNum: response.data.data[0].nb_fan,
			// });
			// if (!artist.id) {
			// 	res.status(200).json("Not found");
			// 	return;
			// }
			res.send(response.data);
			// artist
			// 	.save()
			// 	.then((response) => {
			// 		res.status(200).json(response);
			// 	})
			// 	.catch((error) => {
			// 		res.status(400).json(error);
			// 	});
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
	const apikey_news = "fbeba8d45b5c49e88f83dbb9b40cbe48";

	const querystr = `https://newsapi.org/v2/everything?q="${artist_name}"&apiKey=${apikey_news}`;

	axios
		.get(querystr)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// post search history from database
app.post("/searchHistory", async (req, res) => {
	var data = await Search.find({});
	res.send(data);
});

//localhost:5000/getAllArtist
app.get("/getAllArtist", (req, res) => {
	Artist.find({})
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
});

// get record that selected to delete and delete it from database
app.get("/deleteSearch", async (req, res) => {
	try {
		var a = req.query.search;
		res.send(await Search.findByIdAndDelete(req.query.search));
	} catch (err) {
		res.send(err);
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
