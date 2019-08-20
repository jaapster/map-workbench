import React from 'react';

export const Crosshair = () => (
	<svg
		className="crosshair"
		width="100%"
		height="100%"
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
	>
		<path
			className="cross"
			vectorEffect="non-scaling-stroke"
			d="M20 50L80 50M50 20L50 80"
		/>
		<circle
			className="cross"
			vectorEffect="non-scaling-stroke"
			cx="50" cy="50" r="10" fill="none"
		/>
	</svg>
);