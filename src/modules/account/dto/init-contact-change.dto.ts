import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import {
	userId,
	validateContactIdentifier,
	contact_type
} from 'src/common/config/validator/user.primitive'

const InitContactChange = z
	.object({
		newContact: z.string(),
		userId,
		type: contact_type
	})
	.refine(
		({ type, newContact }) =>
			validateContactIdentifier({ type, identifier: newContact }),
		{
			error: 'Invalid new contact format for the specified type.',
			path: ['newContact', 'type']
		}
	)
	.strict()

export class InitContactChangeDto extends createZodDto(InitContactChange) {}
