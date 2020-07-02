import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Popup from "react-popup";
import "./Popup.css";

import { Link } from "react-router-dom";

// import bootstrap component
import Button from "react-bootstrap/Button";

// Page for showing the recipe detail for selected food recipe with ingredients and publisher link
class eachArtist extends Component {
	constructor() {
		super();
		this.state = {
			artist_id: null,
			artist_name: null,
			top_tracks: [],
			related_news: [],
		};
	}

	startup = () => {
		// get top tracks
		const query_top_tracks = `/getArtistTopTrack?artist_id=${this.state.artist_id}`;
		console.log(query_top_tracks);
		axios
			.get(query_top_tracks)
			.then((result) => {
				console.log(result);
				if (result.data.total === 0) {
					this.setState({ top_tracks: "none" });
					return;
				}
				this.setState({ top_tracks: result.data.data });
			})
			.catch((error) => {
				alert("Error: ", error);
			});

		// get related news
		const query_related_news = `/getArtistRelatedNews?artist_name=${this.state.artist_name}`;
		console.log(query_related_news);
		axios
			.get(query_related_news)
			.then((result) => {
				console.log(result);
				if (result.data.totalResults === 0) {
					this.setState({ related_news: "none" });
					return;
				}
				this.setState({ related_news: result.data.articles });
				// alert(JSON.stringify(this.state.top_tracks[0].preview));
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	componentDidMount = async () => {
		this.state.artist_id = this.props.match.params.artist_id;
		this.state.artist_name = this.props.match.params.artist_name;
		this.startup();
	};

	render() {
		var { artist_name, top_tracks, related_news } = this.state;
		return (
			<div id="eachArtist_body">
				<div class="nav_bar">
					<Link class="back_link" to="/">
						<img
							src="https://image.flaticon.com/icons/svg/725/725004.svg"
							width="30"
							height="auto"
						/>
					</Link>
					<div class="page_title">{artist_name}</div>
				</div>

				<div id="eachArtist_content">
					{/* Top Track */}
					<div id="top_track">
						<h3 id="top_track_title">Top Tracks</h3>
						{top_tracks === "none" ? (
							<h5>Top track is not available at this moment</h5>
						) : (
							top_tracks.map((item) => (
								<div class="each_track">
									<p class="track_title">{item.title}</p>
									<p class="track_recording">
										<audio controls volume="0.1">
											<source src={item.preview} type="audio/ogg" />
										</audio>
									</p>
									<div class="track_link">
										<a href={item.link} target="_blank">
											<Button variant="primary">Full Song</Button>
										</a>
									</div>
								</div>
							))
						)}
					</div>
					{/* Related News */}
					<div id="related_news">
						<h3 id="related_news_title">Related News</h3>
						{related_news.map((item) => (
							<div class="item each_news">
								<div class="item_head each_news">
									<img
										src={item.urlToImage}
										width="auto"
										height="100%"
										alt="News Image"
									/>
								</div>
								<div class="item_body_outer">
									<div class="item_body">
										<h5 class="name mb-4">
											{item.title.length <= 70
												? item.title
												: item.title.substring(0, 70) + "..."}
										</h5>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default eachArtist;
