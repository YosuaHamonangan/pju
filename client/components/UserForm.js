import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import userRoles from "../../global/constants/user-roles";

class Component extends React.Component {
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

export default Component;