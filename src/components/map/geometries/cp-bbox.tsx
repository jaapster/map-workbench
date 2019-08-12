import React from 'react';
import { extent } from '../../../reducers/selectors/index.selectors';
import { connect } from 'react-redux';
import { addToPath } from '../../../utils/util-add-to-path';
import {
	Co,
	BBox,
	State } from '../../../types';

interface Props {
	bbox: BBox;
}

export const _BBox = React.memo(({ bbox: [x1, y1, x2, y2] }: Props) => (
	<g>
		<path
			className="bbox"
			d={ ([[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]] as Co[]).reduce(addToPath, '') }
		/>
	</g>
));

const mapStateToProps = (state: State) => (
	{
		extent: extent(state)
	}
);

export const BBoxSVG = connect(mapStateToProps)(_BBox);
