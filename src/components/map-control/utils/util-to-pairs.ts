export const toPairs = (array: any[]) => array.reduce(function(result, v, i, xs) {
	if (i % 2 === 0) {
    	result.push(xs.slice(i, i + 2));
	}

	return result;
}, []);