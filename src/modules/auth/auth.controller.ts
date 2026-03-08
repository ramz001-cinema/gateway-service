import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { SendOTPDto } from './dto'

@Controller('auth')
export class AuthController {
	@Post('otp/send')
	@HttpCode(HttpStatus.OK)
	sendOtp(@Body() dto: SendOTPDto) {
		console.log(dto)

		return {
			success: true
		}
	}
}
