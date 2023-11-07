import { Redis } from 'ioredis';
import { redis } from '../config/cache.config';

export class RedisConnection {
	private static _connection: Redis;

	public static get connection() : Redis{
		if(!this._connection){
			throw new Error('Não existe essa conexão de cache');
		}

		return this._connection;
	}

	public static async connect() {
		if(!this._connection){
			this._connection = redis;
			console.log('Banco de dados de cache conectado');
		}
	}

	public static async destroy() {
		if(!this._connection){
			throw new Error ('Base de dados não inicializada');
		}
		await this._connection.quit();
		console.log('Banco de dados desconectado');
	}
}