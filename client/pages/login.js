import React from "react";

import services from "../services";
import Router from "next/router";

class Pages extends React.Component {
	state = {};

	login = evt => {
		evt.preventDefault();

		if(this.state.loading) return;

		// this.setState({ loading: true });

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
		return (
			<div>
				<div style={styles.paper}>
					<h1>
						Sign in
					</h1>
					<form style={styles.form} onSubmit={this.login}>
						<input
							required
							label="Username"
							name="username"
							onChange={ evt => this.setState({ username: evt.target.value }) }
						/>
						<input
							required
							type="password"
							label="Password"
							name="password"
							onChange={ evt => this.setState({ password: evt.target.value }) }
						/>
						<button
							type="submit"
							style={styles.submit}
						>
							Sign In
						</button>
					</form>
				</div>
			</div>
		);
	}
}


var styles = {
	paper: {
		marginTop: 90,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: 10,
		backgroundColor: "rgb(220, 0, 78)",
	},
	form: {
		width: "100%",
	},
	submit: {
		margin: "20px 0",
	},
};

export default Pages;