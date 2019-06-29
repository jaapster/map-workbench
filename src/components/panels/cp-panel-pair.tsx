import React from 'react';
import bind from 'autobind-decorator';
import './style/cp-panel-pair.scss';
import { clamp } from '../../utils/util-clamp';
import { mergeClasses } from '../../utils/util-merge-classes';

interface Props {
	min?: number;
	max?: number;
	fixed?: boolean;
	initial?: number;
	vertical?: boolean;
	onResize?: () => void;
	collapsed?: boolean;
	horizontal?: boolean;
}

interface State {
	position: number;
	dragging: boolean;
	collapsed: boolean;
}

const DEFAULT_POSITION = 200;
const DEFAULT_MIN_POSITION = 150;
const DEFAULT_MAX_POSITION = 300;
const DEFAULT_COLLAPSED_POSITION = 10;

@bind
export class PanelPair extends React.Component<Props, State> {
	private ref?: HTMLDivElement;
	private startX: number = 0;
	private startY: number = 0;
	private startPosition: number = 0;

	constructor(props: Props) {
		super(props);

		const {
			initial = DEFAULT_POSITION,
			collapsed = false
		} = props;

		this.state = {
			position: initial,
			dragging: false,
			collapsed
		};
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	private onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
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

	private onPointerMove(e: PointerEvent) {
		const { collapsed } = this.state;

		if (!collapsed) {
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

	private onPointerUp(e: PointerEvent) {
		const { collapsed } = this.state;

		if (this.startX === e.clientX  && this.startY === e.clientY) {
			this.setState(
				{ collapsed: !collapsed },
				this.onResize
			);
		}

		this.removeListeners();

		this.setState({ dragging: false });
	}

	private onResize() {
		const { onResize } = this.props;

		if (onResize) {
			onResize();
		}
	}

	private removeListeners() {
		document.removeEventListener('pointermove', this.onPointerMove);
		document.removeEventListener('pointerup', this.onPointerUp);
	}

	private setRef(e: HTMLDivElement) {
		this.ref = e;
	}

	render() {
		const { children, fixed, horizontal, vertical } = this.props;
		const { position, dragging, collapsed } = this.state;

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
			vertical,
			horizontal,
			position: collapsed ? DEFAULT_COLLAPSED_POSITION : position,
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
