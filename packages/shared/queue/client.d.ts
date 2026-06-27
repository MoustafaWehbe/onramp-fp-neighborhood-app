import { Queue } from "bullmq";
import IORedis from "ioredis";
import { type EmailJobData, type EmbeddingsJobData } from "./types";
export declare function getRedisConnection(): IORedis;
export declare const emailQueue: Queue<EmailJobData, any, string, EmailJobData, any, string> | null;
export declare const embeddingsQueue: Queue<EmbeddingsJobData, any, string, EmbeddingsJobData, any, string> | null;
