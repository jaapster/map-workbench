import bind from 'autobind-decorator';
import React from 'react';
import { Main } from './cp-main';
import { BootService } from '../../services/service.boot';

interface Props {}

interface State {
	booted: boolean;
}

@bind
export class App extends React.Component<Props, State> {
	state = {
		booted: false
	};

	constructor(props: Props) {
		super(props);

		BootService
			.boot()
			.then(this._onBooted);
	}

	componentDidMount() {

	}

	_onBooted() {
		this.setState({ booted: true });
	}

	render() {
		const { booted } = this.state;

		return booted
			? <Main />
			: <div>BOOTING APP</div>;
	}
}
