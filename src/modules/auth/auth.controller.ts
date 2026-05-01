import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger'
import { ZodApiError } from 'src/common/docs/zod-api-error'

import { AuthClientGrpc } from './auth.grpc'
import { SendOTPDto, VerifyOTPDto } from './dto'
import express from 'express'
import { lastValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { EnvType } from 'src/common/config'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly client: AuthClientGrpc,
		private readonly configService: ConfigService<EnvType>
	) {}

	@ApiOperation({
		summary: 'Send OTP',
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

	@ApiOperation({
		summary: 'Verify OTP'
	})
	@ApiBadRequestResponse({
		description: 'Validation failed.',
		schema: {
			type: 'object',
			properties: ZodApiError
		}
	})
	@ApiOkResponse({
		description:
			'OTP has been verified successfully. Refresh token is set as an HTTP-only cookie.',
		schema: {
			type: 'object',
			properties: {
				accessToken: {
					type: 'string',
					description: 'JWT access token for authenticated user.'
				}
			}
		}
	})
	@Post('otp/verify')
	@HttpCode(HttpStatus.OK)
	async verifyOtp(
		@Body() dto: VerifyOTPDto,
		@Res({ passthrough: true }) res: express.Response
	) {
		const { accessToken, refreshToken } = await lastValueFrom(
			this.client.verifyOtp(dto)
		)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure:
				this.configService.get<string>('NODE_ENV') === 'production'
					? true
					: false,
			domain: this.configService.get<string>('COOKIES_DOMAIN'),
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
		})

		return { accessToken }
	}

	@ApiOperation({
		summary: 'Refresh Access Token',
		description:
			"Refresh the user's access token using a valid refresh token stored in an HTTP-only cookie."
	})
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(
		@Req() req: express.Request,
		@Res({ passthrough: true }) res: express.Response
	) {
		const refreshToken = req.cookies?.refreshToken as string | undefined

		if (!refreshToken) {
			throw new BadRequestException('Refresh token is required')
		}

		const { accessToken, refreshToken: newRefreshToken } =
			await lastValueFrom(this.client.refreshToken({ refreshToken }))

		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure:
				this.configService.get<string>('NODE_ENV') === 'production'
					? true
					: false,
			domain: this.configService.get<string>('COOKIES_DOMAIN'),
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
		})

		return { accessToken }
	}
}
