import React from 'react';
import { mergeClasses } from '../../utils/util-merge-classes';

interface Props {
	first?: boolean;
	primary?: boolean;
	children?: any;
	position?: number;
	vertical?: boolean;
	horizontal?: boolean;
	onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const Panel = React.memo((props: Props) => {
	const {
		children, primary, horizontal, position, first, onPointerDown
	} = props;

	const className = mergeClasses('panel', { 'panel-primary': primary });

	const style = {
		[
			primary
				? horizontal
					? 'width'
					: 'height'
				: horizontal
					? first
						? 'right'
						: 'left'
					: first
						? 'bottom'
						: 'top'
		]: position
	};

	return (
		<div className={ className } style={ style }>
			{ children }
			{
				primary
					? (
						<div
							className="panel-drag-handle"
							onMouseUp={ onPointerDown }
						/>
					)
					: null
			}
		</div>
	);
});
