import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import * as microservices from '@nestjs/microservices'
import {
	AccountServiceClient,
	GetProfileRequest
} from '@ramz001-cinema/contracts/gen/account'

export const ACCOUNT_CLIENT_TOKEN = Symbol('ACCOUNT_CLIENT_TOKEN')

@Injectable()
export class AccountClientGrpc implements OnModuleInit {
	private accountService!: AccountServiceClient
	constructor(
		@Inject(ACCOUNT_CLIENT_TOKEN)
		private readonly client: microservices.ClientGrpc
	) {}

	onModuleInit() {
		this.accountService =
			this.client.getService<AccountServiceClient>('AccountService')
	}

	getProfile(request: GetProfileRequest) {
		return this.accountService.getProfile(request)
	}
}
