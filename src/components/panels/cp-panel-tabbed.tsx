import React from 'react';
import { mergeClasses } from '../../utils/util-merge-classes';

interface Props {
	open?: () => any;
	close?: () => any;
	first?: boolean;
	primary?: boolean;
	children?: any;
	position?: number;
	vertical?: boolean;
	horizontal?: boolean;
	onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;

	tabs: any;
}

interface State {
	activeTab: number;
}

export class PanelTabbed extends React.Component<Props, State> {
	state = {
		activeTab: 0
	};

	private _onTabClick(tab: number) {
		const { open, close } = this.props;
		const { activeTab } = this.state;

		if (tab === activeTab) {
			if (close) {
				close();
			}

			this.setState({ activeTab: -1 });
		} else {
			if (open) {
				open();
			}

			this.setState({ activeTab: tab });
		}
	}

	render() {
		const {
			primary, horizontal, position, first, onPointerDown, tabs
		} = this.props;
		const { activeTab } = this.state;

		const className = mergeClasses(
			'panel',
			'panel-tabbed',
			{
				'panel-primary': primary
			}
		);

		const style = {
			[
				primary
					? horizontal
						? 'width'
						: 'height'
					: horizontal
						? first
							? 'right'
							: 'left'
						: first
							? 'bottom'
							: 'top'
				]: position
		};

		return (
			<div className={ className } style={ style }>
				<div className="active-content">
					{
						tabs[ activeTab ]
					}
				</div>
				<div className="toggles">
					{
						tabs.map((tab: any, i: number) => {
							const className = mergeClasses(
								'toggle',
								{
									'active': activeTab === i
								}
							);

							return (
								<div
									key={ i }
									className={ className }
									onClick={ () => this._onTabClick(i) }
								>
									{ i }
								</div>
							);
						})
					}
				</div>
				{
					primary && activeTab > -1
						? (
							<div
								className="panel-drag-handle"
								onPointerDown={ onPointerDown }
							/>
						)
						: null
				}
			</div>
		);
	}
}
