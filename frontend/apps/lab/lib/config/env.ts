/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().url()
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const NODE_ENV = process.env.NODE_ENV;
export const BASE_URL = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'https://lab.catuns.xyz';
