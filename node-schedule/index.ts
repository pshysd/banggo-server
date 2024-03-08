import schedule from 'node-schedule';
import { forcedDeleteUser } from './users';
import { geminiRequestTask } from './counselings';

const deleteUser = schedule.scheduleJob('0 0 0 * * *', forcedDeleteUser);

const geminiRequest = schedule.scheduleJob('*/10 * * * *', geminiRequestTask);

export default deleteUser;
