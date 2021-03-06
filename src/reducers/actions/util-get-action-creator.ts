import { Action } from './actions';

export const getActionCreator = <Data>(type: string) => {
	const token = Symbol();

	return {
		create(data: Data): any {
			return {
				token,
				type,
				data
			};
		},
		validate(action: Action) {
			return action.token === token;
		},
		data(action: any): Data {
			if (action.token !== token) {
				throw new Error(`Action [${ type }] mismatch`);
			}
			return action.data;
		}
	};
};
