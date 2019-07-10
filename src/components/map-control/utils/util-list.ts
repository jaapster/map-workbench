export const dropLast = (n: number, xs: any[]) => xs.slice(0, xs.length - n);

export const toPairs = (array: any[]) => array.reduce((m, v, i, xs) => {
	if (i % 2 === 0) {
		m.push(xs.slice(i, i + 2));
	}

	return m;
}, []);
