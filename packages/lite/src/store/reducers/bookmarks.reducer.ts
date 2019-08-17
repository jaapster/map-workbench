import { Location } from 'se';
import {
	Action,
	ActionSetBookmarks } from 'lite/store/actions/actions';

const STATE: Location[] = [];

export const bookmarksReducer = (state: Location[] = STATE, action: Action): Location[] => {
	if (ActionSetBookmarks.validate(action)) {
		return ActionSetBookmarks.data(action).bookmarks;
	}

	return state;
};
