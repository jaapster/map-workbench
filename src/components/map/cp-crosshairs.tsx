import React from 'react';

export const Crosshair = () => (
	<svg
		className="cross"
		 width="100%"
		 height="100%"
		 viewBox="0 0 100 100"
		 preserveAspectRatio="none"
	>
		<path
			vectorEffect="non-scaling-stroke"
			d="M20 50L80 50M50 20L50 80"
		/>
		<circle
			vectorEffect="non-scaling-stroke"
			cx="50" cy="50" r="10"
		/>
	</svg>
);
