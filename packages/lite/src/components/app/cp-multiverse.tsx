import React from 'react';
import { lang } from 'lite/store/selectors/index.selectors';
import { connect } from 'react-redux';
import { Properties } from './cp-properties';
import { StyleSelector } from './cp-style-selector';
import { WorldSelector } from './cp-world-selector';
import {
	State,
	LanguagePack } from 'se';

interface Props {
	lang: LanguagePack;
}

export const _MultiverseSettings = React.memo(({ lang }: Props) => (
	<Properties>
		<h2>{ lang.multiverse.title }</h2>
		<div className="body">
			<WorldSelector />
			<StyleSelector />
		</div>
	</Properties>

));

const mapStateToProps = (state: State) => (
	{
		lang: lang(state)
	}
);

export const MultiverseSettings = connect(mapStateToProps)(_MultiverseSettings);

