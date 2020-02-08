import React from "react";
import GoogleMapReact from "google-map-react";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Icon from "../components/Icon";
import MapMarker from "../components/MapMarker";
import mapUtils from "../../global/utils/map";
import services from "../services";

var MAX_CHUNK = 50;

class Page extends React.Component {
	state = {
		list: [],
	};

	fetchedSections = {};

	getPjuList = ({bounds}) => {
		this._getPjuList(bounds).catch(console.error);

	};

	async _getPjuList(bounds) {
		this.setState({ loading: true });

		var { 
			nw: { lat: latitudeMax, lng: longitudeMin }, 
			se: { lat: latitudeMin, lng: longitudeMax } 
		} = bounds;

		var sections = mapUtils.range2Sections(longitudeMin, longitudeMax, latitudeMin, latitudeMax);
		sections = sections.filter( section => {
			if(!this.fetchedSections[section]) {
				this.fetchedSections[section] = true;
				return true;
			}
			return false;
		});


		for (var i = 0; i < sections.length; i+=MAX_CHUNK) {
			var chunk = sections.slice(i, i+MAX_CHUNK);
			var sectionsString = chunk.join(",");

			try {
				var data = await services.getPjuList({ sections: sectionsString });
			}
			catch(err) {
				services.errorHandler(err);
				this.setState({ loading: false });
			};

			var list = this.state.list.concat(data);
			this.setState({ list, loading: false });
		}
	}

	componentDidMount() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition( ({ coords }) => {
				this.setState({
					center: {
						lng: coords.longitude,
						lat: coords.latitude,
					},
					zoom: 20
				});
			});
		}
		else {
			this.setState({
				center: { lng: 118.015776, lat: -2.600029 },
				zoom: 4.5
			});
		}
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