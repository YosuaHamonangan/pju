import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
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
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div style={styles.paper}>
					<Avatar style={styles.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<form style={styles.form} onSubmit={this.login}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="email"
							autoComplete="username"
							autoFocus
							onChange={ evt => this.setState({ username: evt.target.value }) }
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							onChange={ evt => this.setState({ password: evt.target.value }) }
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							style={styles.submit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="#" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
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