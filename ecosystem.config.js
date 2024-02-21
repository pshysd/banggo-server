module.exports = {
	apps: [
		{
			name: 'banggo',
			script: 'server.ts',
			instances: 0,
			exec_mode: 'cluster',
			watch: '.',
			interpreter: 'ts-node',
		},
	],
};
