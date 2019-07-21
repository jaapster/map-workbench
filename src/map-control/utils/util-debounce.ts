// Based on https://github.com/bvaughn/debounce-decorator
// with added scope binding (line 18)

/** Default debounce duration (in ms) */
export const DEFAULT_DEBOUNCE_DURATION = 500;

/** Debounces the specified function and returns a wrapper function */
// @ts-ignore
export function _debounce(method, duration = DEFAULT_DEBOUNCE_DURATION) {
	// @ts-ignore
	let timeoutId;
// @ts-ignore
	function debounceWrapper(...args) {
		debounceWrapper.clear();

		timeoutId = setTimeout(() => {
			timeoutId = null;
			// @ts-ignore
			method.apply(this, args);
		}, duration);
	}

	debounceWrapper.clear = function () {
		// @ts-ignore
		if (timeoutId) {
			// @ts-ignore
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	return debounceWrapper;
}

/** Decorates a class method so that it is debounced by the specified duration */
export default function outerDecorator(duration: number) {
	// @ts-ignore
	return function innerDecorator(target, key, descriptor) {
		return {
			configurable: true,
			enumerable: descriptor.enumerable,
			// @ts-ignore
			get: function getter() {
				// Attach this function to the instance (not the class)
				Object.defineProperty(this, key, {
					configurable: true,
					enumerable: descriptor.enumerable,
					value: _debounce(descriptor.value.bind(this), duration)
				});
// @ts-ignore
				return this[key];
			}
		};
	};
}
