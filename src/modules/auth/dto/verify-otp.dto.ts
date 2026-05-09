import { createZodDto } from 'nestjs-zod'
import validator from 'validator'
import z from 'zod'
import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'
import { describeEnum } from 'src/common/docs/describe-enum'

export type ZodEntriesOf<T> = { [Key in keyof T]: z.ZodType<T[Key]> }

const VerifyOTP = z
	.object({
		id: z.string(),
		type: z.enum(ContactType).describe(describeEnum(ContactType)),
		otp: z.string().length(6, 'OTP code must be exactly 6 characters long')
	})
	.refine(
		data => {
			switch (data.type) {
				case ContactType.CONTACT_TYPE_EMAIL:
					return validator.isEmail(data.id)
				case ContactType.CONTACT_TYPE_PHONE:
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

export class VerifyOTPDto extends createZodDto(VerifyOTP) {}
