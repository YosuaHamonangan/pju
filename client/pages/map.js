import React from "react";
import GoogleMapReact from "google-map-react";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Icon from "../components/Icon";
import MapMarker from "../components/MapMarker";
import services from "../services";

class Page extends React.Component {
	state = {};

	getPjuList = ({bounds}) => {
		console.log(bounds)
	};

	componentDidMount() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition( ({ coords }) => {
				this.setState({
					center: {
						lng: coords.longitude,
						lat: coords.latitude,
					},
					zoom: 12
				});
			});
		}
		else {
			this.setState({
				center: { lng: 118.015776, lat: -2.600029 },
				zoom: 4.5
			});
		}

		this.setState({ loading: true });

		services.getPjuList()
			.then( list => {
				this.setState({ list, loading: false });
			})
			.catch( err => {
				services.errorHandler(err);
				this.setState({ loading: false });
			});

	}

	render() {
		var { loading, error, list, center, zoom } = this.state;
		return (
			<Layout>
				<div className="px-5 py-4 h-100">
					<div className="w-100 h-100">
						{ center && 
							<GoogleMapReact
								ref="map"
								bootstrapURLKeys={{ key: process.env.MAP_API_KEY }}
								defaultCenter={center}
								defaultZoom={zoom}
								onChange={this.getPjuList}
							>
								<MapMarker list={list}/>
								{
									// list && 
									// list.map( (pju, i) => (
									// 	<Marker 
									// 		key={i}
									// 		lat={+pju.latitude}
									// 		lng={+pju.longitude}
									// 		data={pju}
									// 	/>
									// ))
								}
							</GoogleMapReact>
						}
					</div>
				</div>
			</Layout>
		);
	}
}

function Marker({data}){
	return (
		<Icon
			icon="map-marker-alt"
			color= {data.idPelanggan ? "blue" : "red"}
			style={{ fontSize: 30 }}
		/>
	);
}

export default Page;