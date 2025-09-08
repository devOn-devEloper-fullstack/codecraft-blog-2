import IORedis from 'ioredis';

const {
  REDIS_URL,
  REDIS_HOST,
  REDIS_PORT = '6379',
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_TLS,
  REDIS_DB = '0'
} = process.env;

export function makeIORedis() {
  if (REDIS_URL) {
    // rediss://user:pass@host:port/db
    return new IORedis(REDIS_URL, {
      // production-friendly options:
      enableReadyCheck: true,
      maxRetriesPerRequest: null, // BullMQ recommends null for cluster/sentinel
      reconnectOnError(err) {
        // retry on READONLY and MOVED/ASK, etc.
        const target = 'READONLY';
        if (err?.message?.includes(target)) return true;
        return false;
      }
    });
  }

  const tls = REDIS_TLS === 'true' ? {} : undefined;
  return new IORedis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    db: Number(REDIS_DB),
    tls, // supply certs/ca if your provider requires; e.g. tls: { rejectUnauthorized: true, ca: '...' }
    enableReadyCheck: true,
    maxRetriesPerRequest: null
  });
}
