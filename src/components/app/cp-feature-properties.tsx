import React from 'react';
import './scss/feature-card.scss';
import { Value } from './cp-value';
import { MapControl } from '../../map-control/map-control';
import {
	EPSG,
	Feature } from '../../types';
import {
	getRadius,
	getCoordinate,
	getFeatureArea,
	getFeatureLength } from './utils/geojson-properties';
import { M, M2 } from '../../constants';

interface Props {
	features: Feature<any>[];
	CRS: EPSG;
}

export const FeatureProperties = React.memo((props: Props) => {
	const { features, CRS } = props;

	return (
		<div className="feature-card">
			<div className="table">
				<div className="row">
					<div className="cell">
						<span>type</span>
					</div>
					<div className="cell">
						<span>
						{
							features.reduce((m, f) => (
								m.includes(f.properties.type)
									? m
									: m.concat(f.properties.type)
							), [] as any).length === 1
								? features[0].properties.type
								: '-'
						}
						</span>
					</div>
				</div>
				<div className="row">
					<div className="cell">
						<span>length</span>
					</div>
					<div className="cell">
						<Value
							value={
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
							}
							unit={ M }
						/>
					</div>
				</div>
				<div className="row">
					<div className="cell">
						<span>area</span>
					</div>
					<div className="cell">
						<Value
							value={
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
							}
							unit={ M2 }
						/>
					</div>
				</div>
				<div className="row">
					<div className="cell">
						<span>center</span>
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
						<span>radius</span>
					</div>
					<div className="cell">
						<Value
							value={
								features.length === 1
									? getRadius(features[0])
									: null
							}
							unit={ M }
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
