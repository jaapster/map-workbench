import { Layer, LayerProps } from './model.layer';

export interface MapProps {
	id: string;
	layers: LayerProps[];
}

export class UniverseMap {
	static create(props: MapProps) {
		return new UniverseMap(props);
	}

	private readonly _id: string;
	private readonly _layers: Layer[];

	constructor({ id, layers }: MapProps) {
		this._id = id;
		this._layers = layers.map(Layer.create);
	}

	get id(): string {
		return this._id;
	}

	get layers(): Layer[] {
		return [...this._layers];
	}

	get json() {
		return {
			id: this._id,
			layers: this._layers.map(l => l.json)
		};
	}
}