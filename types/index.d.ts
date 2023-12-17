import IUser from '../models/user';

declare global {
	interface Error {
		status?: number;
	}

	namespace Express {
		interface User extends IUser {}
	}
}

function getRandomInteger(max) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	getRandomNickname: (type) => {
		if (!['animals', 'characters', 'heros', 'monsters'].includes(type)) return;

		const adjective = adjectives[getRandomInteger(adjectives.length)];
		const noun = data[type][getRandomInteger(data[type].length)];

		return `${adjective} ${noun}`;
	},
};
