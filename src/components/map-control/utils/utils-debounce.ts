// Based on https://github.com/bvaughn/debounce-decorator
// with added scope binding (line 18)

/** Default debounce duration (in ms) */
export const DEFAULT_DEBOUNCE_DURATION = 500;

/** Debounces the specified function and returns a wrapper function */
export function _debounce(method: any, duration = DEFAULT_DEBOUNCE_DURATION) {
	let timeoutId: any;

	function debounceWrapper(...args: any[]) {
		debounceWrapper.clear();

		timeoutId = setTimeout(() => {
			timeoutId = null;
			// @ts-ignore
			method.apply(this, args);
		}, duration);
	}

	debounceWrapper.clear = function () {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	return debounceWrapper;
}

/** Decorates a class method so that it is debounced by the specified duration */
export function debounce(duration: any) {
	return function innerDecorator(target: any, key: any, descriptor: any) {
		return {
			configurable: true,
			enumerable: descriptor.enumerable,
			get: function getter(): any {
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
