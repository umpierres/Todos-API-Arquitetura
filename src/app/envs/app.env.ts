import 'dotenv/config';

export const appEnvs = {
	port: process.env.PORT || 3001,
	ambient: process.env.NODE_ENV
};