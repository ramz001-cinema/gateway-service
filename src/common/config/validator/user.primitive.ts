import z from 'zod'
import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'
import { describeEnum } from 'src/common/docs/describe-enum'
import validator from 'validator'

export const userId = z.string().regex(/^[A-Za-z0-9_-]+$/, 'Invalid ID format')

export const otp = z
	.string()
	.length(6, 'OTP code must be exactly 6 characters long')

export const validateContactIdentifier = ({
	type,
	identifier
}: {
	type: ContactType
	identifier: string
}) => {
	if (type === ContactType.CONTACT_TYPE_EMAIL) {
		return validator.isEmail(identifier)
	}

	if (type === ContactType.CONTACT_TYPE_PHONE) {
		return /^\+[1-9]\d{1,14}$/.test(identifier)
	}

	return false
}

export const contact_type = z
	.enum(ContactType)
	.describe(describeEnum(ContactType))

export const contact_identifier = z
	.object({
		identifier: z
			.string()
			.describe(
				'The contact identifier, which can be an email or phone number based on the type.'
			),
		type: contact_type
	})
	.refine(
		({ type, identifier }) =>
			validateContactIdentifier({ type, identifier }),
		{
			message: 'Invalid identifier format for the specified type',
			path: ['identifier']
		}
	)
