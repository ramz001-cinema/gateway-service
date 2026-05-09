import { describeEnum } from 'src/common/docs/describe-enum'
import { createZodDto } from 'nestjs-zod'
import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'
import validator from 'validator'
import z from 'zod'

const SendOTPRequest = z
	.object({
		id: z.string(),
		type: z.enum(ContactType).describe(describeEnum(ContactType))
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
			path: ['id', 'type']
		}
	)
	.strict()

export class SendOTPDto extends createZodDto(SendOTPRequest) {}
