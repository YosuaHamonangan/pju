import React from "react";
import { latLng2Tile } from "google-map-react/utils";
class Component extends React.Component {

	componentDidMount() {
		var canvas = this.canvas;
		this.ctx = this.canvas.getContext("2d");
	}

	_updateCanvas() {
		var { canvas, ctx, props: { $geoService, list } } = this;
		var width = $geoService.getWidth();
		var height = $geoService.getHeight();

		canvas.width = 2*width;
		canvas.height = 2*height;

		if(!list) return;

		ctx.clearRect(0, 0, width, width);

		list.forEach( ({ longitude, latitude, idPelanggan }, i) => {
			var { x, y } = $geoService.fromLatLngToDivPixel({
				lat: latitude, 
				lng: longitude
			});

			var color = idPelanggan ? "blue" : "red";

			this._drawMarker(x + width, y + height, color);
		});
	}

	_drawMarker(x, y, color) {
		var { ctx } = this;
		ctx.beginPath();

		ctx.fillStyle = color;
		ctx.arc(x, y, 8, 0, 2 * Math.PI);
		ctx.fill();

		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.stroke();
	}

	render() {
		if(this.canvas) this._updateCanvas();

		return (
			<canvas 
				ref={ ele => this.canvas = ele} 
				style={{
					position: "absolute",
					transform: "translate(-50%, -50%)"
				}}
			/>
		);
	}
}

export default Component;