import { Location } from '../types';
import { Action, ActionSetBookmarks } from './actions/actions';

const STATE: Location[] = [];

export const bookmarksReducer = (state: Location[] = STATE, action: Action): Location[] => {
	if (ActionSetBookmarks.validate(action)) {
		return ActionSetBookmarks.data(action).bookmarks;
	}

	return state;
};
