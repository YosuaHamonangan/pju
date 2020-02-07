import React from "react";
import Link from "next/link";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import services from "../services";

class Page extends React.Component {
	state = {};

	componentDidMount() {
		this.setState({ loading: true });

		services.getPjuList()
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
					<a href="/pju/excel" download>
						<Button variant="secondary" className="mb-3">Download Excel</Button>
					</a>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>#</th>
								<th>Latitude</th>
								<th>Longitude</th>
								<th>Daya</th>
							</tr>
						</thead>
						<tbody>
							{ list && 
								list.map( (pju, i) => (
									<tr key={i}>
										<td>{i}</td>
										<td>{pju.latitude}</td>
										<td>{pju.longitude}</td>
										<td>{pju.daya}</td>
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