import { UserData } from 'se';
import {
	Action,
	ActionSetUserData } from 'lite/store/actions/actions';

const STATE: UserData | null = null;

export const userReducer = (state: UserData | null = STATE, action: Action): UserData | null => {
	if (ActionSetUserData.validate(action)) {
		return ActionSetUserData.data(action).userData;
	}

	return state;
};
