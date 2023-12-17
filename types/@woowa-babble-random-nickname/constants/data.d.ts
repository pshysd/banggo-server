import type animals from './animals';
import type characters from './characters';
import type heros from './heros';
import type monsters from './monsters';

declare module '@woowa-babble/random-nickname/constants/data' {
	export interface Data {
		animals: animals[];
		characters: characters[];
		heros: heros[];
		monsters: monsters[];
	}

	const data: Data;

	export default data;
}
