import React from 'react';

interface Props {
	w: number;
	h: number;
}

export const Crosshair = ({ w, h }: Props) => {
	const y = Math.round(h / 2) + 0.5;
	const x = Math.round(w / 2) + 0.5;

	return (
		<svg className="cross">
			<path
				d={ `
					M${ 0 } ${ y }L${ w * 0.4 } ${ y }
					M${ w * 0.6 } ${ y }L${ w * 1 } ${ y }
					M${ x } ${ 0 }L${ x } ${ h * 0.4 }
					M${ x } ${ h * 0.6 }L${ x } ${ h * 1 }
				` }
			/>
			<circle cx={ x } cy={ y } r={ w * 0.1 } />
		</svg>
	);
};
