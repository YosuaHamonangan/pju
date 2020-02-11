import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import services from "../services";
import userRoles from "../../global/constants/user-roles";

class Page extends React.Component {
	state = {};

	submit = result => {
		if(this.state.loading) return;

		var { password, password2, ...data } = result;
		if(password !== password2) {
			return this.setState({ error: "Password tidak sama" });
		}
		data.password = password;

		if(!data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
			return this.setState({ error: "Format email tidak sesuai" })
		}

		this.setState({ loading: true });
		services.registerUser(data)
			.then( list => {
				this.setState({ loading: false });
			})
			.catch( err => {
				var error = services.errorHandler(err);
				this.setState({ loading: false, error });
			});
	}

	render() {
		var { loading, error } =  this.state;
		return (
			<Layout>
				<div className="mx-5 my-4">
					{ loading && <Loading/> }
					{ error && <div className="alert alert-warning px-4" role="alert">{error}</div> }
					<UserForm onSubmit={this.submit}/>
				</div>
			</Layout>
		);
	}
}

class UserForm extends React.Component {
	onSubmit = evt => {
		evt.preventDefault();
		var formData = new FormData(evt.target);
		var data = {};
		for (var [key, val] of formData.entries()) {
			data[key] = val;
		}
		this.props.onSubmit(data);
	}

	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Username
					</Form.Label>
					<Col sm="10">
						<Form.Control name="username" required/>
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Password
					</Form.Label>
					<Col sm="10">
						<Form.Control type="password" name="password" required/>
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Konfirmasi Password
					</Form.Label>
					<Col sm="10">
						<Form.Control type="password" name="password2" required/>
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Nama
					</Form.Label>
					<Col sm="10">
						<Form.Control name="name" required/>
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Email
					</Form.Label>
					<Col sm="10">
						<Form.Control name="email" required/>
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Role
					</Form.Label>
					<Col sm="10">
						<Form.Control as="select" name="role" defaultValue={3} required>
							{userRoles.map( ({id, label}) => (
								<option key={id} value={id}>{label}</option>
							))}
						</Form.Control>
					</Col>
				</Form.Group>
				<Button variant="secondary" type="submit">
					Submit
				</Button>
			</Form>
		);
	}
}

export default Page;