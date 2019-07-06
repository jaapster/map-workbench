import { CIRCLE } from '../../../../services/constants';
import { multiPointToCircle } from '../../utils/util-multi-point-to-circle';
import { geoProject, geoUnproject } from '../../utils/util-geo';

export const realise = (features: any[]) => {
	return features.reduce((m1, f1) => {
		return f1.properties.type === CIRCLE
			? m1.concat(multiPointToCircle(
				f1,
				geoProject,
				geoUnproject
			))
			: m1.concat(f1);
	}, []);
};
