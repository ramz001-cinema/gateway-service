import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import {
	contact_identifier,
	userId,
	validateContactIdentifier
} from 'src/common/config/validator/user.primitive'

const InitContactChange = contact_identifier
	.extend({
		newContact: z.string(),
		userId
	})
	.omit({ identifier: true })
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
