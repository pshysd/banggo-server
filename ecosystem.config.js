module.exports = {
	apps: [
		{
			name: 'banggo',
			script: 'server.ts',
			instances: -1,
			exec_mode: 'cluster',
			watch: '.',
			interpreter: 'ts-node',
			instance_var: 'INSTANCE_ID',
		},
	],
};
