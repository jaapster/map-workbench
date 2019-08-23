import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Collapsible } from '../cp-collapsible';
import { RadioButtons } from '../cp-radio-buttons';
import {
	lang,
	maps,
	currentMapId } from 'lite/store/selectors/index.selectors';
import {
	State,
	LanguagePack } from 'se';
import { ActionSetCurrentMap } from 'lite/store/actions/actions';

type Foo = [string, any];

interface Props {
	lang: LanguagePack;
	map: string;
	maps: any[];
	setMap: (mapId: string) => void;
}

export const _Maps = React.memo(({ lang, maps, setMap, map }: Props) => {
	return (
		<Collapsible title={ 'MAPS' }>
			<RadioButtons
				value={ map }
				options={ maps.map(({ name }) => [name, name]) as any }
				onChange={ setMap }
			/>
		</Collapsible>
	);
});

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		map: currentMapId(state),
		maps: maps(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setMap(mapId: string) {
			// console.log('set it', mapId); // remove me

			// PrimaryMapControl.setStyle(style);
			// SecondaryMapControl.setStyle(style);
			//
			dispatch(ActionSetCurrentMap.create({ mapId }));
		}
	}
);

export const Maps = connect(mapStateToProps, mapDispatchToProps)(_Maps);
