import { createZodDto } from 'nestjs-zod'
import { contact_identifier } from 'src/common/config/validator/user.primitive'

const SendOTP = contact_identifier.strict()

export class SendOTPDto extends createZodDto(SendOTP) {}
