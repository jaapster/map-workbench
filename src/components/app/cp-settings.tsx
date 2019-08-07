import React from 'react';
import './scss/properties.scss';
import { Properties } from './cp-properties';
import { UnitSystemSelector } from './cp-unit-system-selector';
import { LanguageSelector } from './cp-language-selector';

export const Settings = () => (
	<Properties>
		<h2>Settings</h2>
		<UnitSystemSelector />
		<LanguageSelector />
	</Properties>
);
