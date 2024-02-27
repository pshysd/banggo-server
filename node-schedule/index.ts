import schedule from 'node-schedule';
import { forcedDeleteUser } from './users';

const job = schedule.scheduleJob('0 0 0 * * *', forcedDeleteUser);
