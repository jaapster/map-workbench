import { FeatureCollectionData } from '../../../types';

export const setPropertyAtIndex = (
	data: FeatureCollectionData,
	index: number,
	key: string,
	value: any
) => (
	{
		...data,
		features: data.features.map((feature, i) => (
			i === index
				? {
					...feature,
					properties: {
						...feature.properties,
						[key]: value
					}
				}
				: feature
		))
	}
);
