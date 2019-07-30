import React from 'react';
import './scss/feature-card.scss';
import { EPSG, FeatureData } from '../../types';
import {
	getRadius,
	getCoordinate,
	getFeatureArea,
	getFeatureLength } from './utils/geojson-properties';
import { MapControl } from '../../map-control/map-control';

interface Props {
	features: FeatureData<any>[];
	CRS: EPSG;
}

const Value = ({ value: v, unit, precision = 0 }: any) => (
	<span>
		{
			v == null
				? '-'
				: `${ !isNaN(v) ? v.toFixed(precision) : v }
					${ unit  ? ` ${ unit }`  : '' }`
		}
	</span>
);

export const FeatureProperties = React.memo((props: Props) => {
	const { features, CRS } = props;

	return (
		<div className="feature-card">
			<div className="table">
				<div className="row">
					<div className="cell">
						type
					</div>
					<div className="cell">
						{
							features.reduce((m, f) => (
								m.includes(f.properties.type)
									? m
									: m.concat(f.properties.type)
							), [] as any).length === 1
								? features[0].properties.type
								: '-'
						}
					</div>
				</div>
				<div className="row">
					<div className="cell">
						length
					</div>
					<div className="cell">
						<Value value={
							features.reduce((m, f, i) => {
								const v = getFeatureLength(f);

								return v == null
									? null
									: m === null
										? i > 0
											? null
											: v
										: m + v;
							}, null)
						} unit="m" />
					</div>
				</div>
				<div className="row">
					<div className="cell">
						area
					</div>
					<div className="cell">
						<Value value={
							features.reduce((m, f, i) => {
								const v = getFeatureArea(f);

								return v == null
									? null
									: m === null
										? i > 0
											? null
											: v
										// @ts-ignore
										: m + v;
							}, null)
						} unit="m" />
					</div>
				</div>
				<div className="row">
					<div className="cell">
						center
					</div>
					<div className="cell">
						<Value
							value={
								features.length === 1
									? MapControl.projectToCRS(getCoordinate(features[0]), CRS)
									: null
							}
						/>
					</div>
				</div>
				<div className="row">
					<div className="cell">
						radius
					</div>
					<div className="cell">
						<Value
							value={
								features.length === 1
									? getRadius(features[0])
									: null
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
