import bind from 'autobind-decorator';
import { Dict } from '../../types';

@bind
export class EventEmitter {
	private _subscribers: Dict<Array<Function>>;

    constructor() {
        this._subscribers = {};
    }

    on(eventName: string, fn: Function) {
        if (fn) {
            if (!this._subscribers[eventName]) {
                this._subscribers[eventName] = [];
            }

            this._subscribers[eventName].push(fn);
        }
    }

    off(eventName: string, fn: Function) {
        if (this._subscribers[eventName]) {
            this._subscribers[eventName] = this._subscribers[eventName].filter(e => e !== fn);
        }
    }

    trigger(eventName: string, data?: any) {
        if (this._subscribers[eventName]) {
            this._subscribers[eventName].forEach(fn => fn(data));
        }
    }

    destroy() {
		this._subscribers = {};
	}
}
