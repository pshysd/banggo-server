declare module '@woowa-babble/random-nickname' {
	export interface RandomNicknameModule {
		getRandomNickname(type: 'animals' | 'characters' | 'heros' | 'monsters'): string;
	}

	const randomNickname: RandomNicknameModule;

	export default randomNickname;
}
