import React from "react";
import Link from "next/link";
import { withRouter  } from 'next/router';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import Icon from "../../components/Icon";
import services from "../../services";
import userRoles from "../../../global/constants/user-roles";

class Page extends React.Component {
	state = {};

	submitUpdateData = data => {
		if(this.state.loading) return;

		if(!data.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
			this.show("error", "Format email tidak sesuai");
		}

		this.setState({ loading: true });

		var { kode } = this.props.router.query;
		services.updateUser(kode, data)
			.then( list => {
				this.setState({ loading: false });
				this.show("success", "Data berhasil diubah");
			})
			.catch( err => {
				var error = services.errorHandler(err);
				this.setState({ loading: false });
				this.show("error", error);
			});
	};

	submitUpdatePassword = data => {
		var { currentPassword, password, password2 } = data;
		if(password !== password2) {
			return this.show("error", "Password tidak sama");
		}

		var { kode } = this.props.router.query;
		services.updatePassword(kode, currentPassword, password)
			.then( list => {
				this.setState({ loading: false });
				this.show("success", "Password berhasil diubah");
			})
			.catch( err => {
				var error = services.errorHandler(err);
				this.setState({ loading: false });
				this.show("error", error);
			});
	};

	show(type, msg) {
		if(type === "success") {
			var success = msg;
			var error = null;
		}
		else {
			var success = null;
			var error = msg;
		}
		this.refs.layout.goToTop();
		this.setState({ error, success });
	}

	componentDidMount() {
		this.setState({ loading: true });
		var { kode } = this.props.router.query;

		services.getUser(kode)
			.then( data => this.setState({ data, loading: false }) )
			.catch( err => {
				var error = services.errorHandler(err);
				this.setState({ loading: false });
				this.show("error", error);
			});
	}

	render() {
		var { loading, error, success, data } = this.state;
		return (
			<Layout ref="layout">
				<div className="mx-5 my-4">
					{ loading && <Loading/> }
					{ error && <div className="alert alert-warning px-4" role="alert">{error}</div> }
					{ success && <div className="alert alert-success px-4" role="alert">{success}</div> }
					{ data && <UserForm data={data} className="mb-5" onSubmit={this.submitUpdateData}/> }
					<PasswordForm onSubmit={this.submitUpdatePassword}/>
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
		var { data, className } = this.props;
		return (
			<Form className={className} onSubmit={this.onSubmit}>
				<h2 className="mb-4">Ubah Data User</h2>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Username
					</Form.Label>
					<Col sm="10">
						<Form.Control name="username" defaultValue={data.username} plaintext disabled/>
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Nama
					</Form.Label>
					<Col sm="10">
						<Form.Control name="name" defaultValue={data.name}/>
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Email
					</Form.Label>
					<Col sm="10">
						<Form.Control name="email" defaultValue={data.email}/>
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Role
					</Form.Label>
					<Col sm="10">
						<Form.Control as="select" name="role" defaultValue={data.role} required>
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

class PasswordForm extends React.Component {
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
		var { className } = this.props;
		return (
			<Form className={className} onSubmit={this.onSubmit}>
				<h2 className="mb-4">Ubah Password</h2>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Password Lama
					</Form.Label>
					<Col sm="10">
						<Form.Control type="password" name="currentPassword" required/>
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Password Baru
					</Form.Label>
					<Col sm="10">
						<Form.Control type="password" name="password" required/>
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Konfirmasi Password Baru
					</Form.Label>
					<Col sm="10">
						<Form.Control type="password" name="password2" required/>
					</Col>
				</Form.Group>

				<Button variant="secondary" type="submit">
					Submit
				</Button>
			</Form>
		);
	}
}

export default withRouter(Page);