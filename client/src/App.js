import React, { Component } from "react";
import "./App.css";
import axios from "axios";

// link this page to another page
import { Link } from "react-router-dom";

class App extends Component {
	constructor() {
		super();
	}

	// signals that the all components have rendered properly
	componentDidMount() {}

	startup = async () => {};

	render() {
		return (
			<div class="App home">
				{/* Header */}
				<div class="header home">
					<div>
						{/* Page title */}
						<h1 class="m-0 p-0">Artist and News API</h1>
						<p class="m-0 p-0">Discover your favourite artist and their news</p>
						{/* Login button */}
						<Link
							to={{
								pathname: `/login`,
								state: { previous_path: "/" },
							}}
						>
							<button class="register_btn btn btn-primary btn-lg">Login</button>
						</Link>
						{/* Register button */}
						<Link to="/register">
							<button class="register_btn btn btn-success btn-lg">
								Register
							</button>
						</Link>
						{/* Search bar */}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
