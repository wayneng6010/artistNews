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
	const artist_search =
		req.query.artist_search == "" ? "smith" : req.query.artist_search;

	const querystr = `https://api.deezer.com/search/artist?q=${artist_search}`;

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
			});

			artist
				.save()
				.then((response) => {
					res.status(200).json(response);
				})
				.catch((error) => {
					res.status(400).json(error);
				});

			res.send(response.data);
		})
		.catch((error) => {
			res.status(400).json(error);
		});
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

//localhost:5000/getSameArtist
app.get("/getSameArtist", (req, res) => {
	Artist.findOne({ ID: req.query.artist_id })
		.then((response) => {
			if(response) {
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
app.get('/deleteArtist', (req, res) => {
	Artist.deleteOne({ ID: req.query.artist_id })
	  .then(response => {
		res.status(200).json(response);
	  })
	  .catch(error => {
		res.status(400).json(error);
	  });
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
