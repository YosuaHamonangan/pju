import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
var solidIcons =  require("@fortawesome/free-solid-svg-icons");

function getIconName(name) {
	var camelName = name.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '') );
	return "fa"+ camelName.charAt(0).toUpperCase() + camelName.slice(1);
}

function Icon(props) {
	var { icon, ...iconProps } = props;
	var iconName = getIconName(icon);
	return (
		<FontAwesomeIcon icon={solidIcons[iconName]} {...iconProps}/>
	);
}

export default Icon;