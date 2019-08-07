import React from 'react';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import { Properties } from './cp-properties';
import {
	State,
	Location } from '../../types';

interface Props {
	bookmarks: Location[];
}

export const _Bookmarks = React.memo(({ bookmarks }: Props) => {
	return (
		<Properties>
			<h2>Bookmarks</h2>
			<div className="list">
				{
					bookmarks.map(location => (
						<div
							key={ location.title }
							className="list-item"
							onClick={() => MapControl.setLocation(location)}
						>
							{ location.title }
						</div>
					))
				}
			</div>
		</Properties>
	);
});

const mapStateToProps = (state: State) => (
	{
		bookmarks: state.bookmarks
	}
);

export const Bookmarks = connect(mapStateToProps)(_Bookmarks);
