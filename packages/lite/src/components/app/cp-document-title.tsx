import React from 'react';

interface Props {
	title: string;
}

export const DocumentTitle = React.memo(({ title }: Props) => {
	document.title = title;

	return null;
});
