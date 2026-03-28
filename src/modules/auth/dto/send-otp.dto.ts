import { createZodDto } from 'nestjs-zod'
import validator from 'validator'
import z from 'zod'

const SendOTPRequest = z
	.object({
		id: z.string(),
		type: z.enum(['email', 'phone'])
	})
	.refine(
		data => {
			switch (data.type) {
				case 'email':
					return validator.isEmail(data.id)
				case 'phone':
					return /^\+[1-9]\d{1,14}$/.test(data.id)
				default:
					return false
			}
		},
		{
			error: 'Invalid id format for the specified type.',
			path: ['id']
		}
	)
	.strict()

export class SendOTPDto extends createZodDto(SendOTPRequest) {}
