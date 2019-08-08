import React from 'react';
import './scss/properties.scss';

export const Properties = React.memo(({ children }: any) => {
	return (
		<div className="properties">
			<div className="column">
				{ children }
			</div>
		</div>
	);
});
