import React from "react";

export default class Component extends React.Component {
	state = {}

	_onValueChange =  value => {
		var { onValueChange } = this.props;
		this.setState({ value });
		if(onValueChange) onValueChange(value);
	}

	_getOptions() {
		if(!this.props.getData) return;
		this.props.getData()
			.then( data => this._updateOptions(data) );
	}

	_updateOptions(options) {
		if(!this._isMounted) return;

		this.setState(
			{options, value: ""},
			this.props.onValueChange ? () => this.props.onValueChange("") : null
		);
	}

	getSnapshotBeforeUpdate(prvProps) {
		this.prvGetData = prvProps.getData;
		return null;
	}

	componentDidUpdate() {
		var { getData } = this.props
		if(this.prvGetData === getData) return;
		this._getOptions();
		if(!getData)  this._updateOptions(null);
	}

	componentDidMount() {
		this._isMounted = true;
		this._getOptions();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		var { options, value } = this.state;
		var isValid = Array.isArray(options) && options.length > 0;

		var { id, name, className, onValueChange, required, placeholder } = this.props;
		var props = { id, name, className, required };

		placeholder = placeholder || " -- Pilih salah satu -- ";
		return (
			<select {...props} disabled={!isValid} value={ isValid && value ? value : ""}
				onChange={ evt => {
					var {value} = evt.target;
					this.setState({value});
					if(onValueChange) onValueChange(value);
				}}
			>
				<option disabled value="">{placeholder}</option>
				{ isValid &&
					options.map( ( {value, label}, i) => <option key={i} value={value}>{label}</option> )
				}
			</select>
		);
	}
}
