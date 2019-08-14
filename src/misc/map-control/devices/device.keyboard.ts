import bind from 'autobind-decorator';
import { EventEmitter } from '../../events/event-emitter';

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
				this.trigger('deleteKeyDown');
			}

			if (e.key === 'Escape') {
				this.trigger('escapeKeyDown');
			}

			if (e.key === 'Space') {
				this.trigger('spaceKeyDown');
			}

			if (e.key === 'z') {
				this.trigger('glareKeyDown');
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			if (e.key === 'z') {
				this.trigger('glareKeyUp');
			}
		});
    }
}
