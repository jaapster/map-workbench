import { MapboxStyle } from '../types';

export interface LayerProps {
	id: string;
	style: MapboxStyle;
}

export class Layer {
	static create(props: LayerProps) {
		return new Layer(props);
	}

	private readonly _id: string;
	private readonly _style: MapboxStyle;

	constructor({ id, style }: LayerProps) {
		this._id = id;
		this._style = style;
	}

	get id(): string {
		return this._id;
	}

	get style(): MapboxStyle {
		return this._style;
	}
}
