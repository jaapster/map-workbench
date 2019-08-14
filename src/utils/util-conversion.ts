import { PRECISION } from '../constants/constants';

export const mToFt = (m: number) => m * 3.2808399;

export const feetToMeters = (ft: number) => ft / 3.2808399;

export const milesToMeters = (mi: number) => mi * 1609.344;

export const m2ToFt2 = (m2: number) => m2 * 10.7639104;

export const mToDisplay = (m: number) => m < 1000
	? `${ m.toFixed(PRECISION) } m`
	: `${ (m / 1000).toFixed(PRECISION) } km`;

export const ftToDisplay = (ft: number) => ft < 5280
	? `${ ft.toFixed(PRECISION) } ft`
	: `${ (ft / 5280).toFixed(PRECISION) } mi`;

export const m2ToDisplay = (m2: number) => m2.toFixed(0).length > 5
	? `${ (m2 / 1000000).toFixed(PRECISION) } km²`
	: `${ m2.toFixed(PRECISION) } m²`;

export const ft2ToDisplay = (ft2: number) => ft2 < 27878400
	? `${ ft2.toFixed(PRECISION) } ft²`
	: `${ (ft2 / 27878400).toFixed(PRECISION) } mi²`;
