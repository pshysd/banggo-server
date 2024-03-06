import { Op } from 'sequelize';
import User from '../../models/user';
import dayjs from 'dayjs';

const forcedDeleteUser = async () => {
	if (process.env.INSTANCE_ID === '0') {
		const today = dayjs();
		const oneWeekAgo = today.subtract(7, 'day').format('yyyy-MM-DD HH:mm:ss');
		const deletedUsers = await User.findAll({
			where: {
				deletedAt: {
					[Op.lt]: oneWeekAgo,
				},
			},
		});

		if (deletedUsers.length !== 0) {
			deletedUsers.map((user) => {
				user.destroy({
					force: true,
				});
			});
		}
	}
};

export { forcedDeleteUser };
