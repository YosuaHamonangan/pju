import React from "react";
import Link from "next/link";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import AsyncSelect from "../components/AsyncSelect";
import services from "../services";

class Page extends React.Component {
	state = {};

	getPjuList = async () => {
		var { provinsi, kota, kecamatan, kelurahan } = this.state;
		var filter = {};
		if(provinsi) filter.provinsi = provinsi;
		if(kota) filter.kota = kota;
		if(kecamatan) filter.kecamatan = kecamatan;
		if(kelurahan) filter.kelurahan = kelurahan;

		try {
			var list = await services.getPjuList(filter);
			this.setState({ list, loading: false });
		}
		catch(err) {
			var error = services.errorHandler(err);
			this.setState({ loading: false, error });
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.getPjuList();
	}

	render() {
		var { list } = this.state;
		return (
			<Layout>
				<div className="mx-5 my-4">
					<a href="/pju/excel" download>
						<Button variant="secondary" className="mb-3">Download Excel</Button>
					</a>
					<h3>Filter: </h3>
					<div className="row">
						<div className="col-3">
							<AsyncSelect
								placeholder="Provinsi"
								className="w-100"
								getData={services.getProvinsi}
								onValueChange={ value => 
									this.setState({
										provinsi: value,
										getKota: value ? () => services.getKota(value) : null
									}) 
								}
							/>
						</div>

						<div className="col-3">
							<AsyncSelect
								placeholder="Kota/Kabupaten"
								className="w-100"
								getData={this.state.getKota}
								onValueChange={ value => 
									this.setState({
										kota: value,
										getKecamatan: value ? () => services.getKecamatan(value) : null
									}) 
								}
							/>
						</div>

						<div className="col-3">
							<AsyncSelect
								placeholder="Kecamatan"
								className="w-100"
								getData={this.state.getKecamatan}
								onValueChange={ value => 
									this.setState({
										kecamatan: value,
										getKelurahan: value ? () => services.getKelurahan(value) : null
									}) 
								}
							/>
						</div>

						<div className="col-3">
							<AsyncSelect
								placeholder="Kelurahan/Desa"
								className="w-100"
								getData={this.state.getKelurahan}
								onValueChange={ value => 
									this.setState({ kelurahan: value }) 
								}
							/>
						</div>
					</div>

					<Button 
						variant="secondary" 
						className="mt-1 mb-3 py-0"
						onClick={this.getPjuList}
					>
						Cari
					</Button>

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