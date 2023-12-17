import Sequelize from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: Sequelize.QueryInterface, Sequelize: Sequelize.Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert('Category', [
			{
				id: 0,
				name: '인간관계',
			},
			{
				id: 1,
				name: '취업',
			},
			{
				id: 2,
				name: '금전',
			},
			{
				id: 3,
				name: '일상',
			},
			{
				id: 4,
				name: '범죄',
			},
			{
				id: 5,
				name: '건강',
			},
			{
				id: 6,
				name: '연애',
			},
			{
				id: 999,
				name: '직접 작성하기',
			},
		]);
	},

	async down(queryInterface: Sequelize.QueryInterface, Sequelize: Sequelize.Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
