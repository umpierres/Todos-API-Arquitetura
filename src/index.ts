import { randomUUID } from "crypto";
import { User } from "./app/classes";
import { RedisConnection } from "./main/database";
console.log("rodou")
async function test() {
    await RedisConnection.connect()

    const redis = RedisConnection.connection;

    redis.set('name','Alexandra Umpierres')
    redis.set('age', 20)

    console.log(await redis.get('name'))
    console.log(await redis.get('age'))

    await redis.del('name')

    console.log(await redis.get('name'))

    const usuario = new User(randomUUID(),'alexandraumpierres@outlook.com','123456')

    await redis.set('usuario-1', JSON.stringify(usuario.toJSON()))
    const user1cache = await redis.get('usuario-1')
    console.log(JSON.parse(user1cache ?? '{}'))

}

test()