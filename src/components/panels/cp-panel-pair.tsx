import React from 'react';
import bind from 'autobind-decorator';
import './scss/cp-panel-pair.scss';
import { clamp } from '../../utils/util-clamp';
import { mergeClasses } from '../app/utils/util-merge-classes';
import { connect } from 'react-redux';
import { ActionSetPanelCollapsed } from '../../reducers/actions';
import { Dispatch } from 'redux';

interface Props {
	panelGroupId: string;
	min?: number;
	max?: number;
	fixed?: boolean;
	initial?: number;
	vertical?: boolean;
	onResize?: () => void;
	collapsed?: boolean;
	horizontal?: boolean;

	panels: any;
	setCollapsed?: any;
}

interface State {
	position: number;
	dragging: boolean;
}

const DEFAULT_POSITION = 200;
const DEFAULT_MIN_POSITION = 150;
const DEFAULT_MAX_POSITION = 300;
const DEFAULT_COLLAPSED_POSITION = 64;

@bind
export class _PanelPair extends React.PureComponent<Props, State> {
	protected collapsedPosition = DEFAULT_COLLAPSED_POSITION;

	protected ref?: HTMLDivElement;
	protected startX: number = 0;
	protected startY: number = 0;
	protected startPosition: number = 0;

	constructor(props: Props) {
		super(props);

		const {
			initial = DEFAULT_POSITION
		} = props;

		this.state = {
			position: initial,
			dragging: false
		};
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	protected onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
		const { fixed } = this.props;

		if (!fixed) {
			const { position } = this.state;

			this.startPosition = position;
			this.startX = e.clientX;
			this.startY = e.clientY;

			document.addEventListener('pointermove', this.onPointerMove);
			document.addEventListener('pointerup', this.onPointerUp);

			this.setState({ dragging: true });
		}
	}

	protected onPointerMove(e: PointerEvent) {
		if (!this.getCollapsed()) {
			const {
				children,
				horizontal,
				max = DEFAULT_MAX_POSITION,
				min = DEFAULT_MIN_POSITION
			} = this.props;

			const dif = horizontal
				? e.clientX - this.startX
				: e.clientY - this.startY;

			// @ts-ignore
			const fact = children[0].props.primary ? 1 : -1;

			this.setState({
				position: clamp(
					this.startPosition + dif * fact,
					min,
					max
				)
			}, this.onResize);
		}
	}

	protected onPointerUp(e: PointerEvent) {
		if (this.startX === e.clientX  && this.startY === e.clientY) {
			this.toggle();
		}

		this.removeListeners();

		this.setState({ dragging: false });
	}

	protected toggle() {
		const { panelGroupId, setCollapsed } = this.props;

		setCollapsed(panelGroupId, !this.getCollapsed());

		this.onResize();
	}

	protected open() {
		const { panelGroupId, setCollapsed } = this.props;

		setCollapsed(panelGroupId, false);

		this.onResize();
	}

	protected close() {
		const { panelGroupId, setCollapsed } = this.props;

		setCollapsed(panelGroupId, true);

		this.onResize();
	}

	protected onResize() {
		const { onResize } = this.props;

		if (onResize) {
			setTimeout(onResize);
		}
	}

	protected removeListeners() {
		document.removeEventListener('pointermove', this.onPointerMove);
		document.removeEventListener('pointerup', this.onPointerUp);
	}

	protected setRef(e: HTMLDivElement) {
		this.ref = e;
	}

	protected getCollapsed() {
		const { panels, panelGroupId } = this.props;
		const { collapsed } = panels[panelGroupId] || { collapsed: false };

		return collapsed;
	}

	render() {
		const collapsed = this.getCollapsed();
		const { children, fixed, horizontal, vertical } = this.props;
		const { position, dragging } = this.state;

		if (
			(!horizontal && !vertical) ||
			!Array.isArray(children) ||
			children.length !== 2 ||
			!children.reduce((m, c: any) => m || c.props.primary, false)
		) {
			console.warn('PanelPair problem.');
			return null;
		}

		const className = mergeClasses(
			'panel-pair',
			{
				'panel-pair-fixed': fixed,
				'panel-pair-vertical': vertical,
				'panel-pair-horizontal': horizontal,
				'panel-pair-collapsed': collapsed
			}
		);

		const props = {
			open: this.open,
			close: this.close,
			vertical,
			horizontal,
			position: collapsed ? this.collapsedPosition : position,
			onPointerDown: this.onPointerDown
		};

		const [a, b] = children;

		return (
			<div className="panel-pair-container">
				<div className={ className } ref={ this.setRef }>
					{
						[
							// @ts-ignore
							React.cloneElement(a, { key: 'a', first: true, ...props }),
							// @ts-ignore
							React.cloneElement(b, { key: 'b', first: false, ...props })
						]
					}
				</div>
				{
					dragging
						? <div className="shield" />
						: null
				}
			</div>
		);
	}
}

const mapStateToProps = (state: any) => (
	{
		panels: state.ui.panels
	}
);

const mapDispatchToProps = (dispatch: Dispatch) => (
	{
		setCollapsed(panelGroupId: string, collapsed: boolean) {
			dispatch(ActionSetPanelCollapsed.create({ panelGroupId, collapsed }));
		}
	}
);

export const PanelPair = connect(mapStateToProps, mapDispatchToProps)(_PanelPair);
