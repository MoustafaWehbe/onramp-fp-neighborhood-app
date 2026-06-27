"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingsQueue = exports.emailQueue = void 0;
exports.getRedisConnection = getRedisConnection;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const types_1 = require("./types");
function isRedisEnabled() {
    return process.env.REDIS !== "false";
}
let redisConnection = null;
function getRedisConnection() {
    if (!isRedisEnabled()) {
        throw new Error("Redis is disabled");
    }
    if (!redisConnection) {
        const url = process.env.REDIS_URL ?? "redis://localhost:6379";
        redisConnection = new ioredis_1.default(url, {
            maxRetriesPerRequest: null,
        });
    }
    return redisConnection;
}
function createQueue(name) {
    if (!isRedisEnabled()) {
        return null;
    }
    return new bullmq_1.Queue(name, {
        connection: getRedisConnection(),
        defaultJobOptions: {
            attempts: 3,
            backoff: { type: "exponential", delay: 1000 },
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 500 },
        },
    });
}
exports.emailQueue = createQueue(types_1.QUEUE_NAMES.EMAIL);
exports.embeddingsQueue = createQueue(types_1.QUEUE_NAMES.EMBEDDINGS);
//# sourceMappingURL=client.js.map