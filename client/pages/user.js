import React from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import services from "../services";

class Page extends React.Component {
	state = {};

	componentDidMount() {
		this.setState({ loading: true });

		services.getUserList()
			.then( list => this.setState({ list, loading: false }) )
			.catch( err => {
				var error = services.errorHandler(err);
				this.setState({ loading: false, error });
			});
	}

	render() {
		var { list } = this.state;
		return (
			<Layout>
				<div className="mx-5 my-4">
					<Button variant="secondary" className="mb-3">User Baru</Button>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>#</th>
								<th>Username</th>
								<th>Name</th>
								<th>Role</th>
							</tr>
						</thead>
						<tbody>
							{ list && 
								list.map( (user, i) => (
									<tr key={i}>
										<td>{i}</td>
										<td>{user.username}</td>
										<td>{user.name}</td>
										<td>{user.role}</td>
									</tr>
								))
							}
						</tbody>
					</Table>
				</div>
			</Layout>
		);
	}
}

export default Page;