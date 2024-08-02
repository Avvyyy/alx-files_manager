const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Promisify methods for async/await usage
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setexAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    this.client.on('error', (error) => {
      console.error(`Redis client not connected to the server: ${error.message}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  // Get the value of a key in Redis
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(`Error getting value for key "${key}": ${error.message}`);
      return null;
    }
  }

  // Set a key-value pair in Redis with an expiration time
  async set(key, value, duration) {
    try {
      await this.setexAsync(key, duration, value);
    } catch (error) {
      console.error(`Error setting value for key "${key}": ${error.message}`);
    }
  }

  // Delete a key from Redis
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (error) {
      console.error(`Error deleting key "${key}": ${error.message}`);
    }
  }
}

// Exporting the redis client instance
const redisClient = new RedisClient();
module.exports = redisClient;
