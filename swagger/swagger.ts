import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: '방구석 고민 해결사',
			description: 'hello',
		},
		servers: [
			{
				url: 'http://localhost:3005',
			},
		],
	},
	apis: ['./routes/*.ts'],
};

const specs = swaggerJsDoc(options);

export { swaggerUI, specs };
