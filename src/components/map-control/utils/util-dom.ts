import { Point } from 'mapbox-gl';

export const DOM = {
	// @ts-ignore
	create(tagName: any, className: string | null, container: HTMLElement): HTMLElement {
		const el = document.createElement(tagName);

		if (className != null) {
			el.className = className;
		}

		if (container != null) {
			container.appendChild(el);
		}

		return el;
	},

	remove(node: HTMLElement) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	},

	mousePos(el: HTMLElement, e: PointerEvent) {
		const rect = el.getBoundingClientRect();
		return new Point(
			e.clientX - rect.left - el.clientLeft,
			e.clientY - rect.top - el.clientTop
		);
	}
};
