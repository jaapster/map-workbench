import bind from 'autobind-decorator';
import './scss/cp-panel-pair.scss';
import { PanelPair } from './cp-panel-pair';

const DEFAULT_COLLAPSED_POSITION = 32;

@bind
export class PanelPairTabbed extends PanelPair {
	protected collapsedPosition = DEFAULT_COLLAPSED_POSITION;

	protected onPointerUp(e: PointerEvent) {
		this.removeListeners();
		this.setState({ dragging: false });
	}
}
