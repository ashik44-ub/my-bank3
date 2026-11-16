import mongoose from 'mongoose';
import dns from 'node:dns';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Sandbox-only: with MONGO_TUNNEL=1, map the Atlas shard hostnames to the
// local tunnel addresses (see scripts/mongo-tunnel.mjs). Not needed on a
// normal machine or on Vercel — there the URI connects directly.
// NOTE: the mongodb driver calls dns.lookup with { all: true }, so the patch
// must return an array in that case.
if (process.env.MONGO_TUNNEL === '1') {
  const TUNNEL_MAP = {
    'ac-bicswhv-shard-00-00.xfoof9s.mongodb.net': '127.0.0.2',
    'ac-bicswhv-shard-00-01.xfoof9s.mongodb.net': '127.0.0.3',
    'ac-bicswhv-shard-00-02.xfoof9s.mongodb.net': '127.0.0.4',
  };
  const origLookup = dns.lookup;
  dns.lookup = (hostname, options, callback) => {
    const target = TUNNEL_MAP[hostname];
    if (target) {
      const cb = typeof options === 'function' ? options : callback;
      const opts = typeof options === 'object' && options !== null ? options : {};
      const family = typeof opts.family === 'number' ? opts.family : 4;
      if (typeof cb === 'function') {
        if (opts.all) cb(null, [{ address: target, family }]);
        else cb(null, target, family);
        return;
      }
    }
    return origLookup.call(dns, hostname, options, callback);
  };
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
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
