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
class register extends Component {
	constructor() {
		super();
	}

	handleSubmit = async (e) => {
		e.preventDefault();

		const name = this.refs.name.value,
			email = this.refs.email.value,
			psw = this.refs.psw.value,
			cpsw = this.refs.cpsw.value;

		var emailExisted;

		// check if there is similar email in user table
		await axios
			.get(`/getSameEmail?email=${email}`)
			.then((result) => {
				console.log(result);
				if (result.data) {
					// email existed in database
					emailExisted = true;
				} else {
					// email not existed in database
					emailExisted = false;
				}
			})
			.catch((error) => {
				alert("Error: ", error);
			});

		if (emailExisted) {
			alert("Email already been registered before");
		} else if (psw === cpsw) {
			if (psw.length >= 8) {
				fetch("/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user: {
							name: name,
							email: email,
							psw: psw,
						},
					}),
				})
					.then((result) => {
						console.log(result);
						// clear form input
						this.refs.name.value = "";
						this.refs.email.value = "";
						this.refs.psw.value = "";
						this.refs.cpsw.value = "";
                        alert("Register Successful");
					})
					.catch((error) => {
						alert("Register failed");
					});
			} else {
				alert("Password should be at least 8 characters");
			}
		} else {
			alert("Password does not match");
		}
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
					<div class="page_title">Registration Form</div>
				</div>
				{/* Registration Form */}
				<div class="search d-flex justify-content-center pt-5">
					<div className="col-sm-3 pt-5">
						<h1 class="text-center">Register Now</h1>
						<br />
						<form
							name="register_form"
							method="post"
							id="register_form"
							onSubmit={this.handleSubmit}
						>
							{/* input group */}
							<input
								placeholder="Name"
								type="text"
								className="form-control"
								name="name"
								ref="name"
								required
							/>
							<br />
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
								placeholder="Confirm Password"
								type="password"
								className="form-control"
								name="cpsw"
								ref="cpsw"
								required
							/>
							<br />
							<input
								id="search_submit_btn"
								class="btn btn-success w-100"
								type="submit"
								value="Register"
							/>
						</form>
						<br />
					</div>
				</div>
			</div>
		);
	}
}

export default register;
