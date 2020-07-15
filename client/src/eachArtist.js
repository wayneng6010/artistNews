import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Popup from "react-popup";
import "./Popup.css";

import { Link } from "react-router-dom";

// import bootstrap component
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

// Page for showing the recipe detail for selected food recipe with ingredients and publisher link
class eachArtist extends Component {
	constructor() {
		super();
		this.state = {
			artist_id: null,
			artist_name: null,
			top_tracks: [],
			related_news: [],
			sortBy: "relevancy",
			language: "",
			username: null,
		};
	}

	getTopTracks = () => {
		// get top tracks
		const query_top_tracks = `/getArtistTopTrack?artist_id=${this.state.artist_id}`;
		console.log(query_top_tracks);
		axios
			.get(query_top_tracks)
			.then((result) => {
				console.log(result);
				// if api return 0 result
				if (result.data.total === 0) {
					this.setState({ top_tracks: "none" });
					return;
				}
				// api error
				// if api return contains 'error' object
				if ("error" in result.data) {
					Popup.alert(
						"Error: " +
							result.data.error.type +
							" -> " +
							result.data.error.message
					);
					return;
				}
				this.setState({ top_tracks: result.data.data }); // store response data in top_tracks state
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	getRelatedNews = () => {
		// get related news
		const query_related_news = `/getArtistRelatedNews?artist_name=${this.state.artist_name}&sortBy=${this.state.sortBy}&language=${this.state.language}`;
		console.log(query_related_news);
		axios
			.get(query_related_news)
			.then((result) => {
				console.log(result);
				// no result
				if (result.data.totalResults === 0) {
					this.setState({ related_news: "none" });
					return;
				}
				// error
				if (result.data.status === "error") {
					Popup.alert(
						"Error: " + result.data.code + " -> " + result.data.message
					);
					this.setState({ related_news: "none" });
					return;
				}
				this.setState({ related_news: result.data.articles }); // store response data in related_news state
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	saveArtist = () => {
		// save artist to database
		const query_save_artist = `/saveArtist?artist_id=${this.state.artist_id}`;
		console.log(query_save_artist);
		axios
			.get(query_save_artist)
			.then((result) => {
				console.log(result);
				alert("Saved Successful");
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	// used to check if there is same artist saved in database
	checkSavedArtist = async () => {
		// await is to make sure all the code is executed before going to the next line of code
		var result = await axios
			.get(`/getSameArtist?artist_id=${this.state.artist_id}`)
			.then((result) => {
				console.log(result);
				if (result.data) {
					// item existed in database
					return true;
				} else {
					// item not existed in database
					return false;
				}
			})
			.catch((error) => {
				alert("Error: ", error);
			});

		if (result) {
			alert("Artist has been saved before");
		} else {
			this.saveArtist();
		}
	};

	// language
	filter_news = (event) => {
		// get user chosen filter language option
		this.state.language = event.target.value;
		this.getRelatedNews();
	};

	// sort by
	sort_news = (event) => {
		// get user chosen sort by option
		this.state.sortBy = event.target.value;
		this.getRelatedNews();
	};

	componentDidMount = async () => {
		// verify token
		var verify;
		const query_verify = `/verifyToken`;
		console.log(query_verify);
		await axios
			.get(query_verify)
			.then((result) => {
				// alert(result.data);
				if (
					result.data === "Access Denied" ||
					result.data === "Invalid Token"
				) {
					verify = false;
					alert("You are not logged in");
					window.location.href = "/login";
				} else {
					verify = true;
				}
			})
			.catch((error) => {
				alert(error);
			});

		if (verify) {
			// get user name
			const query_uname = `/getUserName`;
			console.log(query_uname);
			await axios
				.get(query_uname)
				.then((result) => {
					console.log(result);
					this.setState({ username: result.data });
				})
				.catch((error) => {
					alert(error);
				});

			// get artist id and name
			this.state.artist_id = this.props.match.params.artist_id; // to search for top tracks from api
			this.state.artist_name = this.props.match.params.artist_name; // to show in header
			this.getTopTracks();
			this.getRelatedNews();
		}
	};

	render() {
		var {
			artist_name,
			artist_id,
			top_tracks,
			related_news,
			username,
		} = this.state;
		return (
			<div id="eachArtist_body" class="pb-3">
				{/* nav bar */}
				<div class="nav_bar">
					<Link
						class="back_link"
						to={{
							pathname: `/searchArtist`,
						}}
					>
						<img
							src="https://image.flaticon.com/icons/svg/725/725004.svg"
							width="30"
							height="auto"
						/>
					</Link>
					<div class="page_title">{artist_name}</div>
					{/* Show user name */}
					<span class="manage_btn username_1 username_2">
						Logged in as {username}
					</span>
					{/* Manage button */}
					<Link
						class="manage_btn2_outer"
						to={{
							pathname: `/savedArtist`,
						}}
					>
						<button
							id="manage_btn2"
							variant="light"
							class="manage_btn small btn btn-success btn-sm"
						>
							Manage
						</button>
					</Link>
					{/* Logout button */}
					<Link
						to={{
							pathname: `/logout`,
							state: {
								previous_path: `/eachArtist/${artist_id},${artist_name}`,
							},
						}}
					>
						<button class="manage_btn small btn btn-danger btn-sm">
							Logout
						</button>
					</Link>
				</div>
				{/* content */}
				<div id="eachArtist_content">
					{/* save button */}
					<p class="text-right">
						<Button onClick={this.checkSavedArtist} id="save_artist_btn">
							&#43;&nbsp;&nbsp;Save This Artist
						</Button>
					</p>
					{/* Top Track */}
					<div id="top_track">
						<h3 id="top_track_title">Top Tracks</h3>
						<p id="top_track_content">
							{top_tracks === "none" ? (
								<h5>
									Top tracks of this artist is not available at the moment
								</h5>
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
												<Button variant="info">Full Song</Button>
											</a>
										</div>
									</div>
								))
							)}
						</p>
					</div>
					{/* popup box to alert user */}
					<div>
						<Popup />
					</div>
					{/* Related News */}
					<div id="related_news">
						<h3 class="mt-2 mb-4" id="related_news_title">
							Related News
						</h3>

						<p class="sorting_outer text-center">
							<table class="sorting_table">
								<tr id="language_row">
									<td id="language_title">Language</td>
									<td class="language_type">
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												value=""
												name="language"
												id="all"
												onChange={this.filter_news.bind(this)}
												defaultChecked
											/>
											<label class="form-check-label" for="all">
												All
											</label>
										</div>
									</td>
									<td class="language_type">
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												value="en"
												name="language"
												id="en"
												onChange={this.filter_news.bind(this)}
											/>
											<label class="form-check-label" for="en">
												English
											</label>
										</div>
									</td>
								</tr>
								<tr id="sortby_row">
									<td id="sortby_title">Sort By</td>
									<td class="sortby_type">
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												value="relevancy"
												name="sorting"
												id="rel"
												onChange={this.sort_news.bind(this)}
												defaultChecked
											/>
											<label class="form-check-label" for="rel">
												Relevance
											</label>
										</div>
									</td>
									<td class="sortby_type">
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												value="popularity"
												name="sorting"
												id="pop"
												onChange={this.sort_news.bind(this)}
											/>
											<label class="form-check-label" for="pop">
												Popularity
											</label>
										</div>
									</td>
									<td class="sortby_type">
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												value="publishedAt"
												name="sorting"
												id="lat"
												onChange={this.sort_news.bind(this)}
											/>
											<label class="form-check-label" for="lat">
												Latest
											</label>
										</div>
									</td>
								</tr>
							</table>
						</p>

						<p id="related_news_content">
							{related_news == "none" ? (
								<h5>No related news at the moment</h5>
							) : (
								related_news.map((item) => (
									<a class="each_news_link" href={item.url} target="_blank">
										<div class="item each_news">
											<div class="item_head each_news">
												<img
													src={item.urlToImage}
													width="100%"
													height="auto"
													alt="News Image"
												/>
											</div>
											<div class="item_body_outer each_news">
												<div class="item_body">
													<h5 class="name each_news mt-3 mb-3">
														{item.title.length <= 200
															? item.title
															: item.title.substring(0, 200) + "..."}
													</h5>
													<div class="news_source_date">
														<p class="d-inline-block w-50 text-center">
															<span class="news_source">
																{item.source.name}
															</span>
														</p>
														<p class="d-inline-block w-50 text-center">
															<span class="news_date">
																{item.publishedAt.substring(0, 10)}
															</span>
														</p>
													</div>
												</div>
											</div>
										</div>
									</a>
								))
							)}
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default eachArtist;
