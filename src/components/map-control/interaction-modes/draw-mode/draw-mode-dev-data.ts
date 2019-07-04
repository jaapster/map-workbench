import {
	POINT,
	CIRCLE,
	POLYGON,
	FEATURE,
	RECTANGLE,
	LINE_STRING,
	MULTI_POINT,
	// MULTI_POLYGON,
	FEATURE_COLLECTION
} from '../../../../services/constants';

export const data = {
	type: FEATURE_COLLECTION,
	features: [
		{
			type: FEATURE,
			geometry: {
				type: POINT,
				coordinates: [-123.84677582550688, 46.19473437827497]
			},
			properties: {
				type: POINT
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
			},
			properties: {
				type: LINE_STRING
			}
		},
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
			},
			properties: {
				type: POLYGON
			}
		},
		{
			type: FEATURE,
			geometry: {
				type: MULTI_POINT,
				coordinates: [
					[-123.84123974610145, 46.19354610907058],
					[-123.84012467194094, 46.19277372030021]
				]
			},
			properties: {
				type: CIRCLE
			}
		},
		{
			type: FEATURE,
			geometry: {
				type: POLYGON,
				coordinates: [[
					[-123.85893381499643,46.19799248925327],
					[-123.85464228057813,46.20096287374676],
					[-123.85035074615315,46.19799248925327],
					[-123.85464228057813,46.19502194417933],
					[-123.85893381499643,46.19799248925327]
					// [-123.850, 46.194],
					// [-123.856, 46.194],
					// [-123.856, 46.198],
					// [-123.850, 46.198],
					// [-123.850, 46.194]
				]]
			},
			properties: {
				type: RECTANGLE
			}
		}
	]
};