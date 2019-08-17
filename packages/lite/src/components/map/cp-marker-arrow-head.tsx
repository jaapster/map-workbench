import React from 'react';

export const MarkerArrowHead = () => (
	<marker
		id="arrow"
		viewBox="0 0 10 10"
		refX="10"
		refY="5"
		markerWidth="6"
		markerHeight="6"
		orient="auto-start-reverse"
	>
		<path className="arrow-head selected" d="M 0 0 L 10 5 L 0 10 z" />
	</marker>
);
