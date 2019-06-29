export const mergeClasses = (...args: Array<any>) => args.reduce((m1, arg) => (
	typeof arg === 'string'
		? `${ m1 }${ arg } `
		: (
			typeof arg === 'object'
				? `${ m1 }${ Object.keys(arg).reduce((m2: string, className: string) => (
					arg[className] ? `${ m2 }${ className } ` : m2
				), '') }`
				: m1
		)
), '');
