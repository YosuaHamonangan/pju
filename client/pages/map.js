import React from "react";
import GoogleMapReact from "google-map-react";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import services from "../services";

const AnyReactComponent = ({ text }) => <div>{text}</div>;
class Page extends React.Component {
	static defaultProps = {
		center: {
			lat: -2.600029,
			lng: 118.015776
		},
		zoom: 4.5
	};

	state = {};

	render() {
		var { loading, error } = this.state;
		console.log(process.env.MAP_API_KEY)
		return (
			<Layout>
				<div className="px-5 py-4 h-100">
					<div className="w-100 h-100">
						<GoogleMapReact
							bootstrapURLKeys={{ key: process.env.MAP_API_KEY }}
							defaultCenter={this.props.center}
							defaultZoom={this.props.zoom}
						>
							<AnyReactComponent
								lat={59.955413}
								lng={30.337844}
								text="My Marker"
							/>
						</GoogleMapReact>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Page;