import React, { Component } from "react";
import "./App.css";
import axios from "axios";

// link this page to another page
import { Link } from "react-router-dom";

// Page for showing the recipe detail for selected food recipe with ingredients and publisher link
class logout extends Component {
	constructor() {
		super();
	}

	logout = async () => {
		await fetch("/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((jsonData) => {
				console.log(jsonData);
				if(jsonData) {
					alert("Logout successful");
					window.location.href = "/";
				} else {
					alert("Logout failed");
					window.location.href = "/searchArtist";
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	componentDidMount = async () => {
		this.logout();
	};

	render() {
		return <div></div>;
	}
}

export default logout;
