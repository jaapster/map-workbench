import bind from 'autobind-decorator';
import React from 'react';
import './scss/collapsible.scss';

interface Props {
	title: string;
	children: any;
}

interface State {
	collapsed: boolean;
}

@bind
export class Collapsible extends React.Component<Props, State> {
	state = { collapsed: false };

	private _toggle() {
		this.setState({ collapsed: !this.state.collapsed });
	}

	render() {
		const { children, title } = this.props;
		const { collapsed } = this.state;

		return (
			<div className="collapsible">
				<h3 onClick={ this._toggle }>
					{ title }
					<i className={ collapsed ? 'icon-arrow-down' : 'icon-arrow-up1' } />
				</h3>
				{
					collapsed
						? null
						: children
				}
			</div>
		);
	}
}
