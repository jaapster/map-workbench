import React from 'react';
import { Point } from '../../types';

interface Props {
	context: {
		location: Point;
		items: any[];
	};
	close: any;
}

export const ContextMenu = (props: Props) => {
	const { context: { location: { x, y }, items }, close } = props;

	const onMouseDown = () => {
		close();
		window.removeEventListener('mousedown', onMouseDown);
	};

	window.addEventListener('mousedown', onMouseDown);

	return (
		<div>
			<div className="context-menu list" style={ { top: y, left: x } } >
				{
					items.map((item, i) => {
						return (
							<div
								key={ i }
								className="list-item"
								onMouseDown={ item[1] }
							>
								{ item[0] }
							</div>
						);
					})
				}
			</div>
		</div>
	);
};
