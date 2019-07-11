import {
	POINT,
	FEATURE,
	LINE_STRING,
	FEATURE_COLLECTION
} from '../constants';

export const data = {
	type: FEATURE_COLLECTION,
	features: [
		{
			type: FEATURE,
			geometry: {
				type: POINT,
				coordinates: [
					-123.84677582550688, 46.19473437827497
				]
			},
			properties: {
				type: POINT,
				id: '6ced3830-a3b3-11e9-969f-874b30e3a365'
			}
		},
		{
			type: FEATURE,
			geometry: {
				type: LINE_STRING,
				coordinates: [
					[-123.83854902682879, 46.19947770219255],
					[-123.83859194183685, 46.19665576385509],
					[-123.83408583069064, 46.196239887092986],
					[-123.834514984136, 46.19329895447109],
					[-123.83108175693133, 46.192704808167235]
				]
			},
			properties: {
				type: LINE_STRING,
				id: '8f60ccb0-a3b3-11e9-91f3-e33c2b894ae6'
			}
		}
	]
};
