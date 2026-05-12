import { Module } from '@nestjs/common'
import { AccountController } from './account.controller'
import { ACCOUNT_V1_PACKAGE_NAME } from '@ramz001-cinema/contracts/gen/account/v1'
import { PROTO_PATHS, PROTO_ROOT } from '@ramz001-cinema/contracts'
import { ACCOUNT_CLIENT_TOKEN, AccountClientGrpc } from './account.grpc'
import { createGrpcClient } from 'src/common/utils'

@Module({
	controllers: [AccountController],
	imports: [
		createGrpcClient(
			ACCOUNT_CLIENT_TOKEN,
			{
				package: ACCOUNT_V1_PACKAGE_NAME,
				protoPath: PROTO_PATHS.ACCOUNT,
				loader: {
					includeDirs: [PROTO_ROOT]
				}
			},
			'AUTH_GRPC_URL'
		)
	],
	providers: [AccountClientGrpc]
})
export class AccountModule {}
