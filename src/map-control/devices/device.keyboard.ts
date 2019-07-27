import bind from 'autobind-decorator';
import { EventEmitter } from '../../event-emitter';

@bind
export class KeyboardDevice extends EventEmitter {
    static create() {
        return new KeyboardDevice();
    }

    destroy() {

	}

    constructor() {
        super();

		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (['Backspace', 'Delete'].includes(e.key)) {
				this.trigger('deleteKey');
			}

			if (e.key === 'Escape') {
				this.trigger('escapeKey');
			}

			if (e.key === 'Space') {
				this.trigger('spaceKey');
			}
		});
    }
}
