import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  /* schema start */
  VISITOR_API_URL: z.string(),
  DISCORD_WEBHOOK_ID: z.string(),
  DISCORD_WEBHOOK_TOKEN: z.string(),
  /* schema end */
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const NODE_ENV = process.env.NODE_ENV;
/* vars start */
export const VISITOR_API_URL = process.env.VISITOR_API_URL;
export const DISCORD_WEBHOOK_ID = process.env.DISCORD_WEBHOOK_ID;
export const DISCORD_WEBHOOK_TOKEN = process.env.DISCORD_WEBHOOK_TOKEN;
/* vars end */
