import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Popup from "react-popup";
import "./Popup.css";

// link this page to another page
import { Link } from "react-router-dom";

// import bootstrap component
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// Page for showing the recipe detail for selected food recipe with ingredients and publisher link
class savedArtist extends Component {
	constructor() {
		super();
		this.state = {
			saved_artist: [],
			modal_show: false,
			edit_id: null,
			edit_name: null,
			imgurl: "",
			username: null,
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
				if (result.data == "") {
					this.setState({ saved_artist: "none" });
					return;
				}
				this.setState({
					saved_artist: result.data,
				});
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
				this.getAllArtist(); // refresh saved artist
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	handleModal = (record_id, artist_name) => {
		this.setState({
			modal_show: !this.state.modal_show,
			edit_id: record_id,
			edit_name: artist_name,
		});
	};

	handleChange = (e) => {
		this.setState({
			imgurl: e.target.value,
		});
	};

	editArtistPhoto = () => {
		// validate the image url 
		if (
			this.state.imgurl ===
			"https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png"
		) {
			alert("Invalid image URL");
		} else {
			const query = `/updateArtistImage?record_id=${this.state.edit_id}&image_url=${this.state.imgurl}`;
			axios
				.get(query)
				.then((result) => {
					if (result.data) {
						alert("Artist image has been updated");
						this.setState({
							modal_show: !this.state.modal_show, // make the bootstrap modal disappear 
							imgurl: "",
						});
						this.getAllArtist(); // refresh saved artist
					} else {
						alert("Artist image failed to update");
					}
				})
				.catch((error) => {
					alert("Error: ", error);
				});
		}
	};

	componentDidMount = async () => {
		// verify token
		const query_verify = `/verifyToken`;
		console.log(query_verify);
		await axios
			.get(query_verify)
			.then((result) => {
				if (
					result.data === "Access Denied" ||
					result.data === "Invalid Token"
				) {
					alert("You are not logged in");
					window.location.href = "/login";
				}
			})
			.catch((error) => {
				alert(error);
			});

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

		this.getAllArtist();
	};

	render() {
		var { saved_artist, username, edit_id, edit_name, imgurl } = this.state;

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
					<div class="page_title">Bookmark</div>
					{/* Show user name */}
					<span class="manage_btn username_1">Logged in as {username}</span>
					{/* Logout button */}
					<Link
						to={{
							pathname: `/logout`,
							state: { previous_path: "/savedArtist" },
						}}
					>
						<button class="manage_btn small btn btn-danger btn-sm">
							Logout
						</button>
					</Link>
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
										<div class="item eachArtist eachSavedArtist" key={item._id}>
											<img
												class="item_head saved"
												src={item.PictureURL}
												width="100%"
												height="290"
												alt="Artist Image"
											/>
											<div
												class="changeImage_btn"
												onClick={() => {
													this.handleModal(item._id, item.Name); // item id indicate which artist is currently editing
												}}
											>
												Change image
											</div>
											<Modal show={this.state.modal_show}>
												<Modal.Header>
													<Modal.Title>
														Upload a new photo for {edit_name}
													</Modal.Title>
												</Modal.Header>
												<Modal.Body>
													<input
														type="text"
														placeholder="URL of image"
														onChange={this.handleChange}
													></input>
													<p></p>
													<img
														src={imgurl}
														onError={() => {
															this.setState({
																imgurl:
																	"https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png",
															});
														}}
														width="100%"
													/>
												</Modal.Body>
												<Modal.Footer>
													<Button
														variant="secondary"
														onClick={() => {
															this.handleModal();
														}}
													>
														Cancel
													</Button>
													<Button
														variant="primary"
														onClick={() => {
															this.editArtistPhoto();
														}}
													>
														Save
													</Button>
												</Modal.Footer>
											</Modal>

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
																	window.confirm(
																		"Delete this artist from bookmark?"
																	)
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
