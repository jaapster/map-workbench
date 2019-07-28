import bind from 'autobind-decorator';
import React from 'react';
import './style/properties.scss';
import { SelectionService } from '../../services/service.selection';
import { Properties } from './cp-properties';
import { FeatureJSON } from '../../types';
import { FeatureProperties } from './cp-feature-properties';
import { MessageService } from '../../services/service.message';

interface Props {}

interface State {
	features: FeatureJSON<any>[];
}

@bind
export class Selection extends React.Component<Props, State> {
	state = {
		features: []
	};

	componentDidMount() {
		MessageService.on('update:crs', this._update);
		SelectionService.on('update:selection', this._update);
		this._update();
	}

	componentWillUnmount() {
		MessageService.off('update:crs', this._update);
		SelectionService.off('update:selection', this._update);
	}

	private _update() {
		this.setState({
			features: SelectionService.getSelection()
		});
	}

	render() {
		const { features } = this.state;

		return (
			<Properties>
				<h2>Selection properties</h2>
				<FeatureProperties features={ features } />
			</Properties>
		);
	}
}
