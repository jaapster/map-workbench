import React from 'react';
import './scss/properties.scss';
import { Properties } from './cp-properties';
import { UnitSystemSelector } from './cp-unit-system-selector';
import { LanguageSelector } from './cp-language-selector';
import { ScaleSelector } from './cp-scale-selector';

export const Settings = () => (
	<Properties>
		<h2>Settings</h2>
		<UnitSystemSelector />
		<LanguageSelector />
		<ScaleSelector />
	</Properties>
);
