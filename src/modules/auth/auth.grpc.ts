import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import {
	AuthServiceClient,
	SendOtpRequest,
	VerifyOtpRequest
} from '@ramz001-cinema/contracts'

@Injectable()
export class AuthClientGrpc implements OnModuleInit {
	private authService: AuthServiceClient
	constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

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
}
