import 'dotenv/config';

export const redisEnvs = {
    url: process.env.REDIS_URL!,
    host:process.env.REDIS_HOST!,
    port:process.env.REDIS_PORT!,
    password:process.env.REDIS_PASSWORD!,
    username:process.env.REDIS_USERNAME!,
}