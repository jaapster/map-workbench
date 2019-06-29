import {
	POLYGON,
	FEATURE,
	LINE_STRING,
	MULTI_POLYGON,
	FEATURE_COLLECTION
} from '../../../../services/constants';

export const data = {
	type: FEATURE_COLLECTION,
	features: [
		{
			type: FEATURE,
			geometry: {
				type: POLYGON,
				coordinates: [
					[
						[-123.83720570374243, 46.19663555557153],
						[-123.83982353974116, 46.19455613953636],
						[-123.82952385712504, 46.193843178773506],
						[-123.83720570374243, 46.19663555557153]
					],
					[
						[-123.8370340423636, 46.19586321023155],
						[-123.83325749206949, 46.19464525897337],
						[-123.83823567200204, 46.19491261644467],
						[-123.8370340423636, 46.19586321023155]
					]
				]
			}
		},
		{
			type: FEATURE,
			geometry: {
				type: LINE_STRING,
				coordinates: [
					[-123.84123974610145, 46.19354610907058],
					[-123.83012467194094, 46.19277372030021]
				]
			}
		}
	]
};
