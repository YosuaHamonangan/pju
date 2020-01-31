import React from 'react';

export default function({ className, height }) {
	return (
		<div 
			className={className + " d-flex justify-content-center align-items-center"} 
			style={{ height: height ? `${height}px` : null }}
		>
			<div className="spinner-border" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
}
