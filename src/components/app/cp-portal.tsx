import ReactDOM from 'react-dom';

type PortalProps = {
	destination: string,
	children: any
};

export const Portal = ({ children, destination }: PortalProps) => {
	const container = document.getElementById(destination);

	if (!container) {
		return null;
	}

	return ReactDOM.createPortal(children, container);
};
