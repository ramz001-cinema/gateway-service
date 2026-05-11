import { createZodDto } from 'nestjs-zod'
import {
	contact_identifier,
	otp,
	userId
} from 'src/common/config/validator/user.primitive'

const ConfirmContactChange = contact_identifier
	.extend({
		userId,
		otp
	})
	.omit({ identifier: true })
	.strict()

export class ConfirmContactChangeDto extends createZodDto(
	ConfirmContactChange
) {}
