import React from "react";

import Layout from "../components/Layout";
import Loading from "../components/Loading";
import StatsCard from "../components/StatsCard";
import services from "../services";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faCheckCircle, faBan, faBolt } from '@fortawesome/free-solid-svg-icons';

function estimateKwh(daya) {
	return daya*12/1000;
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
		return (
			<Layout>
				<div className="mx-5 my-4">
					<h2 className="mb-4">Dashboard</h2>
					{ loading && <Loading/> }
					{ error && <div className="alert alert-warning px-4" role="alert">{error}</div> }
					{ data && 
						<div className="row">
							<div className="col-sm-6 col-md-4 col-lg-3 mb-3">
								<StatsCard
									headerIcon={<FontAwesomeIcon icon={faLightbulb} color="#777777"/> }
									label="Total PJU"
									value={`${data.totalLegal + data.totalIlegal} titik`}
								/>
							</div>
							<div className="col-sm-6 col-md-4 col-lg-3 mb-3">
								<StatsCard
									headerIcon={<FontAwesomeIcon icon={faCheckCircle} color="#777777"/> }
									label="PJU Legal"
									value={`${data.totalLegal} titik`}
								/>
							</div>
							<div className="col-sm-6 col-md-4 col-lg-3 mb-3">
								<StatsCard
									headerIcon={<FontAwesomeIcon icon={faBan} color="#777777"/> }
									label="PJU Ilegal"
									value={`${data.totalIlegal} titik`}
								/>
							</div>
							<div className="col-sm-6 col-md-4 col-lg-3 mb-3">
								<StatsCard
									headerIcon={<FontAwesomeIcon icon={faBolt} color="#777777"/> }
									label="Susut/hari"
									value={`${estimateKwh(data.totalDaya)} kWh`}
								/>
							</div>
						</div>
					}
				</div>
			</Layout>
		);
	}
}

export default Page;