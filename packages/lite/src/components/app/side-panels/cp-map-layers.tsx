import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Checklist } from 'lite/components/app/cp-check-list';
import { Collapsible } from 'lite/components/app/cp-collapsible';
import { ActionToggleLayerVisibility } from 'lite/store/actions/actions';
import {
	lang,
	currentMapLayers } from 'lite/store/selectors/index.selectors';
import {
	State,
	LanguagePack } from 'se';

interface Props {
	lang: LanguagePack;
	layers: any[];
	toggleLayerVisibility: (id: string) => void;
}

export const _MapLayers = React.memo(({ lang, layers, toggleLayerVisibility }: Props) => {
	const options: [string, string, boolean][] = layers.map(layer => [layer.name, layer.name, layer.visible]);

	return (
		<Collapsible title={ lang.map.mapLayers }>
			<Checklist options={ options } onChange={ toggleLayerVisibility } />
		</Collapsible>
	);
});

const mapStateToProps = (state: State) => (
	{
		lang: lang(state),
		layers: currentMapLayers(state)
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		toggleLayerVisibility(layerId: string) {
			dispatch(ActionToggleLayerVisibility.create({ layerId }));
		}
	}
);

export const MapLayers = connect(mapStateToProps, mapDispatchToProps)(_MapLayers);
