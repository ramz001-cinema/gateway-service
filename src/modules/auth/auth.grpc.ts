import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import * as microservices from '@nestjs/microservices'
import {
	AuthServiceClient,
	SendOtpRequest,
	VerifyOtpRequest,
	RefreshTokenRequest
} from '@ramz001-cinema/contracts/gen/auth/v1'

export const AUTH_CLIENT_TOKEN = Symbol('AUTH_CLIENT_TOKEN')

@Injectable()
export class AuthClientGrpc implements OnModuleInit {
	private authService!: AuthServiceClient
	constructor(
		@Inject(AUTH_CLIENT_TOKEN)
		private readonly client: microservices.ClientGrpc
	) {}

	onModuleInit() {
		this.authService =
			this.client.getService<AuthServiceClient>('AuthService')
	}

	sendOtp(request: SendOtpRequest) {
		return this.authService.sendOtp(request)
	}

	verifyOtp(request: VerifyOtpRequest) {
		return this.authService.verifyOtp(request)
	}

	refreshToken(request: RefreshTokenRequest) {
		return this.authService.refreshToken(request)
	}
}
