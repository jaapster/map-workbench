import React from 'react';
import './scss/feature-card.scss';
import { lang } from '../../store/selectors/index.selectors';
import { Value } from './cp-value';
import { connect } from 'react-redux';
import { MapControl } from '../../misc/map-control/map-control';
import {
	EPSG,
	State,
	Feature,
	LanguagePack, Geometry
} from '../../types';
import {
	getRadius,
	getCoordinate,
	getFeatureArea,
	getFeatureLength } from '../../utils/util-geometry-properties';
import {
	M,
	M2 } from '../../constants/constants';

interface Props {
	CRS: EPSG;
	lang: LanguagePack;
	features: Feature<Geometry>[];
}

export const _FeatureProperties = React.memo((props: Props) => {
	const { CRS, lang, features } = props;

	const center = features[0] && getCoordinate(features[0]);

	return (
		<div className="feature-card">
			<div className="table">
				<div className="row">
					<div className="cell">
						<span>{ lang.selectionProperties.type }</span>
					</div>
					<div className="cell">
						<span>
						{
							features.reduce((m, f) => (
								m.includes(f.properties.type)
									? m
									: m.concat(f.properties.type)
							), [] as any).length === 1
								? lang.geometries[features[0].properties.type.toLowerCase()]
								: '-'
						}
						</span>
					</div>
				</div>
				<div className="row">
					<div className="cell">
						<span>{ lang.selectionProperties.length }</span>
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
						<span>{ lang.selectionProperties.area }</span>
					</div>
					<div className="cell">
						<Value
							value={
								features.reduce((m, f, i) => {
									const v = getFeatureArea(f);

									return v == null
										? null
										: m !== null
											// @ts-ignore
											? m + v
											: i > 0
												? null
												: v;
								}, null)
							}
							unit={ M2 }
						/>
					</div>
				</div>
				<div className="row">
					<div className="cell">
						<span>{ lang.selectionProperties.center }</span>
					</div>
					<div className="cell">
						<Value
							value={
								features.length === 1 && center
									? MapControl.projectToCRS(center, CRS)
									: null
							}
						/>
					</div>
				</div>
				<div className="row">
					<div className="cell">
						<span>{ lang.selectionProperties.radius }</span>
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

const mapStateToProps = (state: State) => (
	{
		lang: lang(state)
	}
);

export const FeatureProperties = connect(mapStateToProps)(_FeatureProperties);
