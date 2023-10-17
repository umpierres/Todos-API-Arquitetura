import { RedisConnection } from '../../../../main/database';

export class CacheRepository {
	private _redis = RedisConnection.connection;

	public async get<T>(key: string): Promise<T | null> {
		const data = await this._redis.get(key);

		if (!data) return null;

		return JSON.parse(data);
	}

	public async set<T>(key: string, data: T): Promise<'OK'> {
		const dataString = JSON.stringify(data);
		return await this._redis.set(key, dataString);
	}

	public async delete(key: string): Promise<number> {
		return await this._redis.del(key);
	}
}
