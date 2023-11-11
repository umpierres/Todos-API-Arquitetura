import { DataSource, DataSourceOptions } from 'typeorm';
import { appEnvs, postgresEnvs } from '../../app/envs';

const isProduction = appEnvs.ambient?.toLocaleLowerCase() === 'production';
const isTest = appEnvs.ambient?.toLocaleLowerCase() === 'test';
const rootDir = isProduction ? 'dist' : 'src';

const config:DataSourceOptions = {
	type:'postgres',
	url: isTest ? postgresEnvs.urlTest : postgresEnvs.url,
	synchronize: false,
	logging: false,
	ssl: {
		rejectUnauthorized: false,
	},
	entities: [ rootDir + '/app/shared/database/entities/**/*'],
	migrations: [rootDir +'/app/shared/database/migrations/**/*'],
}; 


export default new DataSource(config);