const args = require('command-line-args');

const flagDefinitions = [
	{
		name: 'branding',
		alias: 'b',
		type: String,
		defaultValue: 'se'
	},
	{
		name: 'port',
		alias: 'p',
		type: Number,
		defaultValue: 3010
	},
	{
		name: 'mockPort',
		type: Number,
		defaultValue: 2001
	},
	{
		name: 'backend',
		type: String,
		defaultValue: 'sl60'
	},
	{
		name: 'mock',
		alias: 'm',
		type: Boolean,
		defaultValue: false
	},
	{
		name: 'open',
		alias: 'o',
		type: Boolean,
		defaultValue: false
	},
	{
		name: 'analyze',
		alias: 'a',
		type: Boolean,
		defaultValue: false
	},
	{
		name: 'test',
		alias: 't',
		type: Boolean,
		defaultValue: false
	},
	{
		name: 'brandOnly',
		type: Boolean,
		defaultValue: false
	},
	{
		name: 'reload',
		type: Boolean,
		defaultValue: false
	},
	{
		name: 'mode',
		type: String,
		defaultValue: 'development'
	}
];

module.exports = args(flagDefinitions, { partial: true }); // We allow partial parsing to support unknown arguments (such as Webpack or Node args)
