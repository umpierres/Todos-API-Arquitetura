import 'dotenv/config';

export const postgresEnvs = {
	url: process.env.URL_DATABASE,
	urlTest: process.env.URL_DATABASE_TEST
};