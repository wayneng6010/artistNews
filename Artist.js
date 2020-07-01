const mongoose = require("mongoose");
const db =
	"mongodb+srv://dbUser:627233@clustertesting-j5vap.mongodb.net/Artist?retryWrites=true&w=majority";

//Connect to MongoDB database
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => {
		console.log("Connected to database");
	})
	.catch(() => {
		console.log("Error Connected to database");
	});

//A schema matched the table in your database
const artistSchema = new mongoose.Schema({
	ID: { type: Number },
	Name: { type: String },
	PictureURL: { type: String },
	AlbumNum: { type: Number },
	FansNum: { type: Number },
});

// const newsSchema = new mongoose.Schema({
// 	ArtistName: { type: String },
// 	Title: { type: String },
// 	Desc: { type: String },
// 	Content: { type: String },
// 	Source: { type: String },
// 	Author: { type: String },
// 	URL: { type: String },
// 	Image: { type: String },
// 	PublishedAt: { type: String },
// });

const Artist = mongoose.model("Data", artistSchema);
//const News = mongoose.model("Data", newsSchema);

module.exports = Artist;
//module.exports = News;

