import { getState } from '../store';

export const getCurrentCollectionId = (): string => {
	const {
		multiverse: {
			worlds,
			currentWorldId
		}
	} = getState();

	return worlds[currentWorldId].currentCollectionId;
};

export const getSelection = (collectionId: string): number[][] => {
	const {
		multiverse: {
			worlds,
			currentWorldId
		}
	} = getState();

	return worlds[currentWorldId].collections[collectionId].selection;
};

export const getSelectedFeatures = (collectionId: string) => {
	const selection = getSelection(collectionId).map(([i]) => i);

	return getFeatureCollection(collectionId).features.filter((f: any, i: number) => selection.includes(i));
};

export const getFeatureCollection = (collectionId: string) => {
	const {
		multiverse: {
			worlds,
			currentWorldId
		}
	} = getState();

	return worlds[currentWorldId].collections[collectionId].featureCollection;
};

export const getFeatureAtIndex = (collectionId: string, i: number) => {
	return getFeatureCollection(collectionId).features[i];
};

export const getCurrentCRS = () => getState().mapControl.CRS;
