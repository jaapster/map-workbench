import React, { useState } from 'react';
import './scss/collapsible.scss';

interface Props {
	title: string;
	children: any;
}

export const Collapsible = ({ children, title }: Props) => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="collapsible">
			<h3 onClick={ () => setCollapsed(!collapsed) }>
				{ title }
				<i className={ collapsed ? 'icon-chevron-down' : 'icon-chevron-up' } />
			</h3>
			{
				collapsed ? null : children
			}
		</div>
	);
};
