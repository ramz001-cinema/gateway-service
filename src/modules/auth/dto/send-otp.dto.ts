import { OtpType } from '@ramz001-cinema/contracts/gen/auth'
import { createZodDto } from 'nestjs-zod'
import validator from 'validator'
import z from 'zod'

const SendOTPRequest = z
	.object({
		id: z.string(),
		type: z.enum(OtpType)
	})
	.refine(
		data => {
			switch (data.type) {
				case OtpType.OTP_TYPE_EMAIL:
					return validator.isEmail(data.id)
				case OtpType.OTP_TYPE_PHONE:
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
