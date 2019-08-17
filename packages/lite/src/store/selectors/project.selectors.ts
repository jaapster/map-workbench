import { State } from 'se';
import { createSelector } from 'reselect';
import { appId, projectId } from 'lite/store/selectors/index.selectors';

export const worldInfos = (state: State) => state.system.worlds;
export const currentWorldId = (state: State) => state.multiverse.currentWorldId;
export const currentWorldInfo = (state: State) => createSelector(
	[worldInfos, currentWorldId],
	(worldInfos, currentWorldId) => worldInfos.find(info => info)
);

export const world = createSelector(
	[currentWorldId, projectId],
	(appId, prjId) => `/api/v2/applications/${ appId }/projects/${ prjId }`
);
