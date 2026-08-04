import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const TelegramVerify = z.object({
	query: z.base64url().nonempty('Telegram auth result is required')
})

export class TelegramVerifyDto extends createZodDto(TelegramVerify) {}

export const TelegramAuthResult = z.object({
	id: z.string(),
	first_name: z.string().optional(),
	username: z.string().optional(),
	photo_url: z.url().optional(),
	auth_date: z.string(),
	hash: z.string()
})
