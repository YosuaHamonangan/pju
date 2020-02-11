import React from "react";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import StatsCard from "../components/StatsCard";
import Icon from "../components/Icon";
import services from "../services";

function estimateKwh(daya) {
	return daya*375/1000;
}

class Page extends React.Component {
	state = {};

	componentDidMount() {
		this.setState({ loading: true });

		services.getStatistics()
			.then( data => this.setState({ data, loading: false }) )
			.catch( err => {
				var error = services.errorHandler(err);
				this.setState({ loading: false, error });
			});
	}

	render() {
		var { loading, error, data } = this.state;

		if(data) {
			var totalPju = +data.totalPju;
			var totalPjuIlegal = +data.totalPjuIlegal;
			var totalDaya = +data.totalDaya;
			var totalDayaIlegal = +data.totalDayaIlegal;
			var kwhTotal = estimateKwh(totalDaya);
			var kwhSusut = estimateKwh(totalDayaIlegal);
		}

		return (
			<Layout>
				<div className="mx-5 my-4">
					<h2 className="mb-4">Dashboard</h2>
					{ loading && <Loading/> }
					{ error && <div className="alert alert-warning px-4" role="alert">{error}</div> }
					{ data && 
						<React.Fragment>
							<div className="row">
								<div className="col-md-6 col-lg-4 mb-3">
									<StatsCard
										headerIcon={<Icon icon="lightbulb" color="yellow"/> }
										label="Total PJU"
										value={`${totalPju} titik`}
									/>
								</div>
								<div className="col-md-6 col-lg-4 mb-3">
									<StatsCard
										headerIcon={<Icon icon="check-circle" color="green"/> }
										label="PJU Legal"
										value={`${totalPju - totalPjuIlegal} titik`}
									/>
								</div>
								<div className="col-md-6 col-lg-4 mb-3">
									<StatsCard
										headerIcon={<Icon icon="ban" color="red"/> }
										label="PJU Ilegal"
										value={`${totalPjuIlegal} titik`}
									/>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6 col-lg-4 mb-3">
									<StatsCard
										headerIcon={<Icon icon="plug" color="yellow"/> }
										label="Daya Total"
										value={`${totalDaya} W`}
									/>
								</div>
								<div className="col-md-6 col-lg-4 mb-3">
									<StatsCard
										headerIcon={<Icon icon="plug" color="red"/> }
										label="Daya Hilang"
										value={`${totalDayaIlegal} W`}
									/>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6 col-lg-4 mb-3">
									<StatsCard
										headerIcon={<Icon icon="bolt" color="yellow"/> }
										label="kWh Total"
										value={`${kwhTotal} kWh/bulan`}
									/>
								</div>
								<div className="col-md-6 col-lg-4 mb-3">
									<StatsCard
										headerIcon={<Icon icon="bolt" color="red"/> }
										label="kWh Susut"
										value={`${kwhSusut} kWh/bulan`}
									/>
								</div>
							</div>
						</React.Fragment>
					}
				</div>
			</Layout>
		);
	}
}

export default Page;