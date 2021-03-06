import React from "react";
import Link from "next/link";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Icon from "../components/Icon";
import services from "../services";
import userRoles from "../../global/constants/user-roles";

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
					<Link href="/user-baru">
						<Button variant="secondary" className="mb-3">User Baru</Button>
					</Link>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>#</th>
								<th>Username</th>
								<th>Name</th>
								<th>Role</th>
								<th/>
							</tr>
						</thead>
						<tbody>
							{ list && 
								list.map( (user, i) => (
									<tr key={i}>
										<td>{i}</td>
										<td>{user.username}</td>
										<td>{user.name}</td>
										<td>{userRoles.getById(user.role).label}</td>
										<td>
											<Link href="/user/[kode]" as={`/user/${user.kode}`}>
												<Button variant="secondary" className="py-0">
													<Icon icon="edit" className="mr-2"/>Edit
												</Button>
											</Link>
										</td>
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