import React from 'react';
import './scss/properties.scss';
import { Properties } from './cp-properties';
import { UnitSystemSelector } from './cp-unit-system-selector';

export const Settings = () => (
	<Properties>
		<h2>Settings</h2>
		<div className="body">
			<UnitSystemSelector />
		</div>
	</Properties>
);
