import { Action } from './actions';

export const getActionCreator = <T>(type: string) => (
	{
		create(data: T): any {
			return {
				type,
				data
			};
		},
		validate(action: Action) {
			return action.type === type;
		},
		data(action: any): T {
			return action.data;
		}
	}
);