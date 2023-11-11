import cors from 'cors';
import express from 'express';
import { makeRoutes } from './routes.config';
import { appEnvs } from '../../app/envs';

export function createServer(){
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended:false }));

	makeRoutes(app);

	app.listen(appEnvs.port, () => {
		console.log(`Servidor rodando na porta: ${appEnvs.port}`);
	});

	return app;
}