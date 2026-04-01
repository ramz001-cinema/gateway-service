import z from 'zod'

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	HTTP_PORT: z.coerce.number().int().positive(),
	HTTP_HOST: z.url().nonempty(),
	HTTP_CORS: z.string().nonempty(),
	AUTH_GRPC_URL: z.url().nonempty()
})

export function validateEnv(config: Record<string, unknown>) {
	return envSchema.parse(config)
}
