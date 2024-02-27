import User from '../../models/user';
import dayjs from 'dayjs';

const today = dayjs();
today.format('yyyy-MM-DD HH:mm:ss');

const forcedDeleteUser = async () => {
	console.log('forcedDeleteUser Scheduled');

	const ScheduledUsers = await User.destroy({
		where: { deletedAt: today.subtract(7, 'day') },
		force: true,
	});
};

export { forcedDeleteUser };
