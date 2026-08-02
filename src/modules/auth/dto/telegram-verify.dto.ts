import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const TelegramVerify = z.object({
	query: z.base64url().nonempty('Telegram auth result is required')
})

export class TelegramVerifyDto extends createZodDto(TelegramVerify) {}
