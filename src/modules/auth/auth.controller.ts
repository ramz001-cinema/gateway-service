import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger'
import { OtpType } from '@ramz001-cinema/contracts/gen/auth'
import { ZodApiError } from 'src/common/docs/zod-api-error'

import { AuthClientGrpc } from './auth.grpc'
import { SendOTPDto } from './dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly client: AuthClientGrpc) {}

	@ApiOperation({
		summary: 'Send OTP to user',
		description:
			'Sends a one-time password (OTP) to the user via email or phone for authentication purposes. If user does not exist, it will be created automatically.'
	})
	@ApiBody({
		type: SendOTPDto,
		examples: {
			email: {
				summary: 'Email request example',
				value: {
					id: 'user@example.com',
					type: 'email'
				}
			},
			phone: {
				summary: 'Phone request example',
				value: {
					id: '+1234567890',
					type: 'phone'
				}
			}
		}
	})
	@ApiOkResponse({
		description: 'OTP has been sent successfully.',
		schema: {
			type: 'object',
			properties: {
				ok: {
					type: 'boolean',
					example: true
				}
			}
		}
	})
	@ApiBadRequestResponse({
		description: 'Validation failed.',
		schema: {
			type: 'object',
			properties: ZodApiError
		}
	})
	@Post('otp/send')
	@HttpCode(HttpStatus.OK)
	sendOtp(@Body() dto: SendOTPDto) {
		return this.client.sendOtp({
			id: dto.id,
			type:
				dto.type === 'email'
					? OtpType.OTP_TYPE_EMAIL
					: OtpType.OTP_TYPE_PHONE
		})
	}
}
