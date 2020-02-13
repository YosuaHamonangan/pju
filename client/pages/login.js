import React from "react";
import Router from "next/router";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Loading from "../components/Loading";
import services from "../services";

import "./login.css";

class Page extends React.Component {
	state = {};

	login = evt => {
		evt.preventDefault();

		if(this.state.loading) return;

		this.setState({ loading: true });

		var { username, password } = this.state;
		services.login(username, password)
			.then( () => {
				this.setState({ loading: false });
				Router.push("/");
			})
			.catch( err => {
				var error = services.errorHandler(err);
				this.setState({ loading: false, error });
			});
	};

	render() {
		var { loading, error } = this.state;
		return (
			<div id="login">
				<h1 className="mb-5">Aplikasi Manajemen PJU</h1>
				<Card className="p-5">
					<h2>Sign in</h2>
					{ loading && <Loading/> }
					{ error && <div className="alert alert-warning px-4" role="alert">{error}</div> }
					<Form onSubmit={this.login}>
						<Form.Group controlId="username">
							<Form.Label>Username</Form.Label>
							<Form.Control 
								placeholder="Enter username" 
								onChange={ evt => this.setState({ username: evt.target.value }) }
								required
							/>
						</Form.Group>

						<Form.Group controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control 
								type="password" 
								placeholder="Password" 
								onChange={ evt => this.setState({ password: evt.target.value }) }
								required
							/>
						</Form.Group>

						<Button variant="primary" type="submit">
							Submit
						</Button>
					</Form>
				</Card>
			</div>
		);
	}
}

export default Page;