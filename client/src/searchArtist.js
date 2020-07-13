import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Popup from "react-popup";
import "./Popup.css";

// link this page to another page
import { Link } from "react-router-dom";

// import bootstrap component
import Spinner from "react-bootstrap/Spinner";

class searchArtist extends Component {
	constructor() {
		super();
		this.state = {
			items: [],
			isLoaded: false,
			search: "",
			sortBy: "",
		};

		// this perform a search with predefined value when user enter this page
		this.startup();
		// this.handleSubmit = this.handleSubmit.bind(this);
	}

	// signals that the all components have rendered properly
	componentDidMount() {
	}

	startup = async () => {
		const query = `/getArtist?artist_search=${this.state.search}&order=${this.state.sortBy}`;
		console.log(query);
		await axios
			.get(query)
			.then((result) => {
				console.log(result);
				this.setState({ isLoaded: true, items: result.data.data });
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	sort_artist = (event) => {
		this.state.sortBy = event.target.value;
		this.startup();
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		// empty input
		if (this.state.search.trim() === "") {
			Popup.alert("Empty input");
			return;
		} else {
			this.setState({ isLoaded: false });
		}
		const query = `/getArtist?artist_search=${this.state.search}`;
		console.log(query);
		await axios
			.get(query)
			.then((result) => {
				console.log(result);
				// no result
				if (result.data.total === 0) {
					Popup.alert("Artist Not Found");
					this.setState({ isLoaded: true });
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
					this.setState({ isLoaded: true });
					return;
				}
				this.setState({ isLoaded: true, items: result.data.data });
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// user iput
	handleChange = (e) => {
		e.preventDefault();
		this.setState({ search: e.target.value });
	};

	render() {
		var { isLoaded, items } = this.state;

		// if (!isLoaded) {
		// 	return <div>Loading...</div>;
		// }

		return (
			<div className="App">
				{/* Header */}
				<div class="header">
					<div>
						{/* Register button */}
						<Link to="/register">
							<button class="manage_btn register btn btn-primary btn-lg">
								Register
							</button>
						</Link>
						{/* Manage button */}
						<Link to="/savedArtist">
							<button class="manage_btn btn btn-success btn-lg">
								Manage
							</button>
						</Link>
						{/* Page title */}
						<h1 class="m-0 p-0">Artist and News API</h1>
						<p class="m-0 p-0">Discover your favourite artist and their news</p>
						{/* Search bar */}
						<br />
						<div class="search d-flex justify-content-center">
							<div className="col-sm-8">
								<form
									name="search_form"
									id="search_form"
									onSubmit={this.handleSubmit}
								>
									{/* input group */}
									<div class="input-group mb-2">
										<input
											placeholder="Search for artist"
											type="text"
											className="form-control"
											name="artist_search"
											onChange={this.handleChange}
										/>
										<div class="input-group-append">
											<input
												id="search_submit_btn"
												class="btn btn-secondary"
												type="submit"
												value="Search"
											/>
										</div>
									</div>
									<br />
								</form>
								<br />
							</div>
							{/* popup box to alert user */}
							<div>
								<Popup />
							</div>
						</div>
						{/* Loading Spinner */}
						{isLoaded ? "" : <Spinner animation="border" variant="light" />}
					</div>
				</div>
				{/* Sorting */}
				<p class="sorting_outer text-center artist">
					<table class="sorting_table">
						<tr id="sorting_row">
							<td id="sortby_title">Sort By</td>
							<td class="sortby_type">
								<div class="form-check">
									<input
										class="form-check-input"
										type="radio"
										value="Ranking"
										name="sorting"
										id="Ranking"
										onChange={this.sort_artist.bind(this)}
										defaultChecked
									/>
									<label class="form-check-label" for="Ranking">
										Ranking
									</label>
								</div>
							</td>
							<td class="sortby_type">
								<div class="form-check">
									<input
										class="form-check-input"
										type="radio"
										value="ARTIST_ASC"
										name="sorting"
										id="ARTIST_ASC"
										onChange={this.sort_artist.bind(this)}
									/>
									<label class="form-check-label" for="ARTIST_ASC">
										A to Z
									</label>
								</div>
							</td>
							<td class="sorting_type">
								<div class="form-check">
									<input
										class="form-check-input"
										type="radio"
										value="ARTIST_DESC"
										name="sorting"
										id="ARTIST_DESC"
										onChange={this.sort_artist.bind(this)}
									/>
									<label class="form-check-label" for="ARTIST_DESC">
										Z to A
									</label>
								</div>
							</td>
						</tr>
					</table>
				</p>
				<div class="result pt-5">
					{/* loop through array of objects */}
					{items.map((item) => (
						<Link
							to={{
								pathname: `/eachArtist/${item.id},${item.name}`,
								state: { previous_path: "/" },
							}}
						>
							<div class="item eachArtist" key={item.id}>
								<img
									class="item_head"
									src={item.picture_medium}
									width="100%"
									height="auto"
									alt="Artist Image"
								/>
								<div class="item_body_outer">
									<div class="item_body">
										<h5 class="name mb-4">
											{item.name.length <= 35
												? item.name
												: item.name.substring(0, 35) + "..."}
										</h5>
										<div>
											<p class="fansNum d-inline-block w-50 text-center">
												{item.nb_fan}
												<span>&nbsp;Fans</span>
											</p>
											<p class="albumNum d-inline-block w-50 text-center">
												{item.nb_album}
												<span>&nbsp;Albums</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		);
	}
}

export default searchArtist;
