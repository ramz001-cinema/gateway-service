import { createZodDto } from 'nestjs-zod'
import {
	otp,
	userId,
	contact_type
} from 'src/common/config/validator/user.primitive'
import z from 'zod'

const ConfirmContactChange = z
	.object({
		userId,
		otp,
		type: contact_type
	})
	.strict()

export class ConfirmContactChangeDto extends createZodDto(
	ConfirmContactChange
) {}
