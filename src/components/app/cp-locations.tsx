import React from 'react';
import { connect } from 'react-redux';
import { MapControl } from '../../map-control/map-control';
import { Properties } from './cp-properties';
import {
	State,
	Location, LanguagePack
} from '../../types';
import { lang } from '../../reducers/selectors/index.selectors';

interface Props {
	lang: LanguagePack;
	bookmarks: Location[];
}

export const _Bookmarks = React.memo(({ lang, bookmarks }: Props) => {
	return (
		<Properties>
			<h2>{ lang.bookmarks.title }</h2>
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
		lang: lang(state),
		bookmarks: state.bookmarks
	}
);

export const Bookmarks = connect(mapStateToProps)(_Bookmarks);
