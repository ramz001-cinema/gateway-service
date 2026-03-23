import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger'

import { AuthClientGrpc } from './auth.grpc'
import { SendOTPDto } from './dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly client: AuthClientGrpc) {}

	@ApiOperation({
		summary: 'Send OTP to user',
		description:
			'Sends a one-time password (OTP) to the user via email or phone for authentication purposes.'
	})
	@ApiBody({
		type: SendOTPDto,
		examples: {
			emailExample: {
				summary: 'Email request example',
				value: {
					id: 'user@example.com',
					type: 'email'
				}
			},
			phoneExample: {
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
				success: {
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
			properties: {
				statusCode: {
					type: 'number',
					example: 400
				},
				message: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							code: { type: 'string', example: 'invalid_type' },
							expected: { type: 'string', example: 'string' },
							received: { type: 'string', example: 'undefined' },
							path: {
								type: 'array',
								items: { type: 'string', example: 'id' }
							},
							message: { type: 'string', example: 'Required' }
						}
					}
				},
				error: {
					type: 'string',
					example: 'Bad Request'
				}
			}
		}
	})
	@Post('otp/send')
	@HttpCode(HttpStatus.OK)
	sendOtp(@Body() dto: SendOTPDto) {
		return this.client.sendOtp(dto)
	}
}
