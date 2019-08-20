import React from 'react';

const size = 1.5;

export const MarkerVertex = () => (
	<marker
		id="vertex"
		refX={ size }
		refY={ size }
		orient="auto"
		viewBox={ `0 0 ${ size * 2 } ${ size * 2 }` }
		markerWidth={ size * 2 }
		markerHeight={ size * 2 }
	>
		<circle cx={ size } cy={ size } r={ size } className="vertex" />
	</marker>
);
