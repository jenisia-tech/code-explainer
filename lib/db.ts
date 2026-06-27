import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const LOCAL_FALLBACK = 'mongodb://127.0.0.1:27017/code-explainer';

let mongoMemoryServer: import('mongodb-memory-server').MongoMemoryServer | null = null;

if (!MONGODB_URI) {
  console.warn(
    'MONGODB_URI not set — will attempt local MongoDB or in-memory server for development.'
  );
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const tryConnect = async (uri: string) => {
      return mongoose.connect(uri, opts).then((m) => m);
    };

    // Try configured URI first (if any), otherwise try local fallback.
    const primaryUri = MONGODB_URI || LOCAL_FALLBACK;

    cached.promise = (async () => {
      try {
        return await tryConnect(primaryUri);
      } catch (err) {
        console.error('Failed to connect to primary MongoDB URI:', primaryUri);
        console.error(err);

        // If primary was not the local fallback, attempt local MongoDB before giving up.
        if (primaryUri !== LOCAL_FALLBACK) {
          try {
            console.warn('Attempting local MongoDB fallback at', LOCAL_FALLBACK);
            return await tryConnect(LOCAL_FALLBACK);
          } catch (localErr) {
            console.error('Local MongoDB fallback also failed:', localErr);
            // If still failing and in development, start in-memory MongoDB
            if (process.env.NODE_ENV !== 'production') {
              try {
                const { MongoMemoryServer } = await import('mongodb-memory-server');
                mongoMemoryServer = await MongoMemoryServer.create();
                const uri = mongoMemoryServer.getUri();
                console.warn('Started in-memory MongoDB for development at', uri);
                return await tryConnect(uri);
              } catch (memErr) {
                console.error('mongodb-memory-server failed to start:', memErr);
                throw memErr;
              }
            }
            throw localErr;
          }
        }

        // If primaryUri === LOCAL_FALLBACK and it failed, attempt memory server in dev
        if (process.env.NODE_ENV !== 'production') {
          try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            mongoMemoryServer = await MongoMemoryServer.create();
            const uri = mongoMemoryServer.getUri();
            console.warn('Started in-memory MongoDB for development at', uri);
            return await tryConnect(uri);
          } catch (memErr) {
            console.error('mongodb-memory-server failed to start:', memErr);
            throw memErr;
          }
        }

        throw err;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;