import {Redis} from 'ioredis';
import { redis } from '../config/cache.config';

export class RedisConnection {
    private static _connection: Redis

    public static get connection() : Redis{
        if(!this._connection){
            throw new Error('Não existe essa conexão de cache');
        }

        return this._connection;
    }

    public static async connect() {
        if(!this._connection){
            this._connection = redis
            console.log("Banco de dados de cache conectado")
        }
    }
}