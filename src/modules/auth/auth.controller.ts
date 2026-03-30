import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger'
import { ZodApiError } from 'src/common/docs/zod-api-error'

import { AuthClientGrpc } from './auth.grpc'
import { SendOTPDto, VerifyOTPDto } from './dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly client: AuthClientGrpc) {}

	@ApiOperation({
		summary: 'Send OTP to user',
		description:
			'Sends a one-time password (OTP) to the user via email or phone for authentication purposes. If user does not exist, it will be created automatically.'
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
		return this.client.sendOtp(dto)
	}

	@Post('otp/verify')
	@ApiBadRequestResponse({
		description: 'Validation failed.',
		schema: {
			type: 'object',
			properties: ZodApiError
		}
	})
	@ApiOkResponse({
		description: 'OTP has been verified successfully.',
		schema: {
			type: 'object',
			properties: {
				access_token: {
					type: 'string',
					description: 'JWT access token for authenticated user.'
				},
				refresh_token: {
					type: 'string',
					description:
						'JWT refresh token for obtaining new access tokens.'
				}
			}
		}
	})
	verifyOtp(@Body() dto: VerifyOTPDto) {
		return this.client.verifyOtp(dto)
	}
}
