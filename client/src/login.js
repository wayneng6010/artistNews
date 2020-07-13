import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Popup from "react-popup";
import "./Popup.css";

// link this page to another page
import { Link } from "react-router-dom";

// import bootstrap component
import Button from "react-bootstrap/Button";

// Page for showing the recipe detail for selected food recipe with ingredients and publisher link
class login extends Component {
	constructor() {
		super();
	}

	handleSubmit = async (e) => {
		e.preventDefault();

		const email = this.refs.email.value,
			psw = this.refs.psw.value;

		await fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: {
					email: email,
					psw: psw,
				},
			}),
		})
			.then((res) => {
				console.log(JSON.stringify(res.headers));
				return res.json();
			})
			.then((jsonData) => {
				console.log(jsonData);
				if (jsonData) {
					alert("Login successful");
					window.location.href = "/searchArtist";
				} else {
					alert("Email or password is incorrect");
				}
			})
			.catch((error) => {
				alert("Error: " + error);
			});
	};

	componentDidMount = async () => {};

	render() {
		return (
			<div>
				{/* nav bar */}
				<div class="nav_bar">
					<Link class="back_link" to="/">
						<img
							src="https://image.flaticon.com/icons/svg/725/725004.svg"
							width="30"
							height="auto"
						/>
					</Link>
					<div class="page_title">Login Page</div>
				</div>
				{/* Registration Form */}
				<div class="search d-flex justify-content-center pt-5">
					<div className="col-sm-3 pt-5">
						<h1 class="text-center">Login</h1>
						<br />
						<form
							name="register_form"
							method="post"
							id="register_form"
							onSubmit={this.handleSubmit}
						>
							{/* input group */}
							<input
								placeholder="Email"
								type="email"
								className="form-control"
								name="email"
								ref="email"
								required
							/>
							<br />
							<input
								placeholder="Password"
								type="password"
								className="form-control"
								name="psw"
								ref="psw"
								required
							/>
							<br />
							<input
								id="search_submit_btn"
								class="btn btn-success w-100"
								type="submit"
								value="Login"
							/>
						</form>
						<br />
						{/* Register link */}
						<Link to="/register">
							<p class="text-center">Does not have an account? Register here</p>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default login;
