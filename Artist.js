const mongoose = require("mongoose");
const app = express();
const db =
	"mongodb+srv://dbUser:627233@clustertesting-j5vap.mongodb.net/Artist?retryWrites=true&w=majority";
const path = require("path");

//Connect to MongoDB database
mongoose
	.connect(process.env.MONGODB_URI || db, { useNewUrlParser: true })
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

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
	});
}

const Artist = mongoose.model("Data", artistSchema);
module.exports = Artist;
