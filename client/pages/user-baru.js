import React from "react";
import Layout from "../components/Layout";
import UserForm from "../components/UserForm";
import Loading from "../components/Loading";
import services from "../services";

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

		console.log(data)

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

export default Page;