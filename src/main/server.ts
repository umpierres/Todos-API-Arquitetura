import { DatabaseConnection } from './database/typeorm.connection';
import { app } from './config/server.config';
import { appEnvs } from '../app/envs';


Promise.all([DatabaseConnection.connect()]).then(() => {
    app().listen(appEnvs.port, () => {
        console.log(`Servidor rodando na porta: ${appEnvs.port}`)
    })
}).catch((err)=> console.log(err))

