import z from 'zod'

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	HTTP_PORT: z.coerce.number().int().positive(),
	HTTP_HOST: z.url().nonempty(),
	HTTP_CORS: z.string().nonempty(),
	AUTH_GRPC_URL: z.url().nonempty(),
	// Empty = omit the cookie Domain attribute (web and API on different hosts).
	COOKIES_DOMAIN: z.string().optional(),
	COOKIES_SECRET: z.string().nonempty(),
	PASSPORT_SECRET_KEY: z.string().nonempty()
})

export type EnvType = z.infer<typeof envSchema>

export function validateEnv(config: Record<string, unknown>) {
	return envSchema.parse(config)
}
