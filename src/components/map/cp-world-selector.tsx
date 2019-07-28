import bind from 'autobind-decorator';
import React from 'react';
import { Button, ButtonGroup } from '../app/cp-button';
import { MessageService } from '../../services/service.message';
import { UniverseService } from '../../services/service.universe';

interface Props {}

@bind
export class WorldSelector extends React.Component<Props> {
	componentDidMount() {
		MessageService.on('update:world', this._update);
	}

	componentWillUnmount() {
		MessageService.off('update:world', this._update);
	}

	_update() {
		this.forceUpdate();
	}

	render() {
		const world = UniverseService.getCurrentWorld();

		return (
			<ButtonGroup>
				{
					UniverseService.getWorlds().map((w) => {
						return (
							<Button
								key={ w.id }
								onClick={ () => UniverseService.setCurrentWorld(w.id) }
								depressed={ world.id === w.id }
							>
								{ w.id }
							</Button>
						);
					})
				}
			</ButtonGroup>
		);
	}
}
