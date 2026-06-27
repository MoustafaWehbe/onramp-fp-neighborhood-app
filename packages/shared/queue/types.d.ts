export declare const QUEUE_NAMES: {
    readonly EMAIL: "email";
    readonly EMBEDDINGS: "embeddings";
};
export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
export interface EmailJobData {
    to: string;
    subject: string;
    template: string;
    variables?: Record<string, string>;
}
export interface EmbeddingsJobData {
    entityId: string;
    entityType: string;
    text: string;
}
export type JobData = EmailJobData | EmbeddingsJobData;
export interface EmailJobResult {
    messageId: string;
}
export interface EmbeddingsJobResult {
    dimensions: number;
}
