import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const TelegramVerify = z.object({
	tgAuthResult: z.base64url('Invalid base64url string')
})

export class TelegramVerifyDto extends createZodDto(TelegramVerify) {}
