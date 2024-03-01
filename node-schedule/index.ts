import schedule from 'node-schedule';
import { forcedDeleteUser } from './users';

const deleteUser = schedule.scheduleJob('0 0 0 * * *', forcedDeleteUser);

export default deleteUser;
