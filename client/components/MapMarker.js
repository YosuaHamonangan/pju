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

		var idPelGroups = {};
		list.forEach( (pju, i) => {
			var { longitude, latitude, idPelanggan } = pju;

			var { x, y } = $geoService.fromLatLngToDivPixel({
				lat: latitude, 
				lng: longitude
			});
			x += width;
			y += height;

			var color = "red";
			if(idPelanggan) {
				idPelGroups[idPelanggan] = idPelGroups[idPelanggan]  || [];
				idPelGroups[idPelanggan].push({x, y});
				color = "blue";
			}

			this._drawMarker(x, y, color);
		});

		for(var idPelanggan in idPelGroups) {
			var [start, ...ends] = idPelGroups[idPelanggan];

			ends.forEach( end => {
				var { x: x1, y: y1 } = start;
				var { x: x2, y: y2 } = end;
				this._drawLine(x1, y1, x2, y2, "blue");
				start = end;
			});
		}
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

	_drawLine(x1, y1, x2, y2, color) {
		var { ctx } = this;
		ctx.beginPath();


		ctx.lineWidth = 2;
		ctx.strokeStyle = color;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
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