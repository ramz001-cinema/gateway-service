import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const SendOTPRequest = z
	.object({
		id: z.string(),
		type: z.enum(['email', 'phone'])
	})
	.strict()

export class SendOTPDto extends createZodDto(SendOTPRequest) {}
