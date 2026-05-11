import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import {
	contact_identifier,
	otp
} from 'src/common/config/validator/user.primitive'

export type ZodEntriesOf<T> = { [Key in keyof T]: z.ZodType<T[Key]> }

const VerifyOTP = contact_identifier.extend({
	otp
})

export class VerifyOTPDto extends createZodDto(VerifyOTP) {}
