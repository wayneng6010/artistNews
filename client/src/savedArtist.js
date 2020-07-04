import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Popup from "react-popup";
import "./Popup.css";

import { Link } from "react-router-dom";

// import bootstrap component
import Button from "react-bootstrap/Button";

// Page for showing the recipe detail for selected food recipe with ingredients and publisher link
class savedArtist extends Component {
	constructor() {
		super();
		this.state = {
			saved_artist: [],
		};
	}

	getAllArtist = () => {
		// get top tracks
		const query_saved_artist = `/getAllArtist`;
		console.log(query_saved_artist);
		axios
			.get(query_saved_artist)
			.then((result) => {
				console.log(result);
				if (result.data == '') {
					this.setState({ saved_artist: "none" });
					return;
				}
				this.setState({ saved_artist: result.data });
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	deleteArtist = (artist_id) => {
		const query = `/deleteArtist?artist_id=${artist_id}`;
		axios
			.get(query)
			.then((result) => {
				this.getAllArtist();
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	componentDidMount = async () => {
		this.getAllArtist();
	};

	render() {
		var saved_artist = this.state.saved_artist;

		return (
			<div id="eachArtist_body" class="pb-3">
				{/* nav bar */}
				<div class="nav_bar">
					<Link class="back_link" to="/">
						<img
							src="https://image.flaticon.com/icons/svg/725/725004.svg"
							width="30"
							height="auto"
						/>
					</Link>
					<div class="page_title">Bookmark</div>
				</div>
				{/* content */}
				<div id="eachArtist_content">
					{/* Saved Artist */}
					<div id="related_news">
						<h3 class="mt-2 mb-4" id="related_news_title">
							Saved Artist
						</h3>
						<div class="result pt-4 pb-2 savedArtist">
							<p class="text-center">
								{saved_artist === "none" ? (
									<h5>No saved artist at the moment</h5>
								) : (
									saved_artist.map((item) => (
										<div class="item eachArtist eachSavedArtist" key={item.ID}>
											<img
												class="item_head"
												src={item.PictureURL}
												width="100%"
												height="auto"
												alt="Artist Image"
											/>
											<div class="item_body_outer eachSavedArtist">
												<div class="item_body">
													<h5 class="name mb-4 text-center">
														{item.Name.length <= 35
															? item.Name
															: item.Name.substring(0, 35) + "..."}
													</h5>
													<div class="mb-3">
														<p class="fansNum d-inline-block w-50 text-center">
															{item.FansNum}
															<span>&nbsp;Fans</span>
														</p>
														<p class="albumNum d-inline-block w-50 text-center">
															{item.AlbumNum}
															<span>&nbsp;Albums</span>
														</p>
													</div>

													{/* view button  */}
													<Link
														class="fansNum d-inline-block w-50 text-center px-2"
														target="_blank"
														to={{
															pathname: `/eachArtist/${item.ID},${item.Name}`,
														}}
													>
														<Button variant="primary" size="sm" block>
															View
														</Button>
													</Link>

													{/* delete button  */}
													<div class="fansNum d-inline-block w-50 text-center px-2">
														<Button
															onClick={() => {
																if (
																	window.confirm("Delete this artist from bookmark?")
																) {
																	this.deleteArtist(item.ID);
																}
															}}
															variant="dark"
															size="sm"
															block
														>
															Delete
														</Button>
													</div>
												</div>
											</div>
										</div>
									))
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default savedArtist;
