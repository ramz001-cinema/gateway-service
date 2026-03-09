import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { SendOTPDto } from './dto'

@Controller('auth')
export class AuthController {
	@ApiOperation({
		summary: 'Send OTP to user',
		description:
			'Sends a one-time password (OTP) to the user via email or phone for authentication purposes.'
	})
	@Post('otp/send')
	@HttpCode(HttpStatus.OK)
	sendOtp(@Body() dto: SendOTPDto) {
		console.log(dto)

		return {
			success: true
		}
	}
}
