import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Popup from "react-popup";
// import './Popup.css';

// import bootstrap component
import Jumbotron from "react-bootstrap/Jumbotron";

class App extends Component {
	constructor() {
		super();
		this.state = {
			items: [],
			isLoaded: false,
			search: "",
		};

		// this perform a search with predefined value when user enter this page
		this.startup();
		// this.handleSubmit = this.handleSubmit.bind(this);
	}

	// get data from API
	getAllArtist = () => {
		axios
			.get("/getAllArtist")
			.then((result) => {
				this.setState({
					isLoaded: true,
					//items: result.data,
				});
				//alert(this.state.items.data[0].id);
				//console.log(this.state.items[0]);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// signals that the all components have rendered properly
	componentDidMount() {
		this.getAllArtist();
	}

	startup = () => {
		const query = `/getArtist?artist_search=${this.state.search}`;
		console.log(query);
		axios
			.get(query)
			.then((result) => {
				console.log(result);
				if (result.data === "Not found") {
					Popup.alert("Artist Not Found");
				}
				this.setState({ items: result.data });
				// this.getAllArtist();
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const query = `/getArtist?artist_search=${this.state.search}`;
		console.log(query);
		axios
			.get(query)
			.then((result) => {
				console.log(result);
				if (result.data === "Not found") {
					Popup.alert("Artist Not Found");
				}
				this.setState({ items: result.data });
				// this.getAllArtist();
			})
			.catch((error) => {
				alert("Error: ", error);
			});
	};

	// user iput
	handleChange = (e) => {
		e.preventDefault();
		this.setState({ search: e.target.value });
	};

	render() {
		var { isLoaded, items, search } = this.state;

		// if (!isLoaded) {
		// 	return <div>Loading...</div>;
		// }

		return (
			<div className="App">
				{/* Header */}
				<div class="header">
					<div>
						{/* Manage button */}
						<a href="#"><button id="manage_btn" class="btn btn-success btn-lg">Manage</button></a>
						{/* Page title */}
						<h1 class="m-0 p-0">Artist and News API</h1>
						<p class="m-0 p-0">Discover your favourite artist and their news</p>
						{/* Search bar */}
						<div class="search d-flex justify-content-center">
							<div className="col-sm-8">
								<br />
								{/* <p>Search item: {search}</p> */}
								<form
									name="search_form"
									id="search_form"
									class="mt-4"
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

							<div>
								<Popup />
							</div>
						</div>
					</div>
				</div>
				<div class="result pt-5">
					{/* loop through array of objects */}
					{items.map((item) => (
						<a class="a_item" href="#">
							<div class="item" key={item.id}>
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
										<div class="">
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
						</a>
					))}
				</div>
			</div>
		);
	}
}

export default App;
