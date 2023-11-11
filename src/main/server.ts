import { DatabaseConnection } from './database/typeorm.connection';
import { createServer } from './config/server.config';
import { RedisConnection } from './database';

Promise.all([DatabaseConnection.connect(), RedisConnection.connect()]).then(() => {
	createServer();
}).catch((err)=> console.log(err));

