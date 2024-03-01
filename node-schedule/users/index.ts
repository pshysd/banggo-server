import User from '../../models/user';
import dayjs from 'dayjs';

const today = dayjs();
today.format('yyyy-MM-DD HH:mm:ss');

const forcedDeleteUser = async () => {
	if (process.env.INSTANCE_ID === '0') {
		await User.destroy({
			where: { deletedAt: today.subtract(7, 'day') },
			force: true,
		});
	} else {
		console.log('요청을 확인했으나 실행되지 않았음');
	}
};

export { forcedDeleteUser };
