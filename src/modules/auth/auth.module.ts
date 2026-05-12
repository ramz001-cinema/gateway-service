import { Module } from '@nestjs/common'

import { PROTO_PATHS, PROTO_ROOT } from '@ramz001-cinema/contracts'
import { AuthController } from './auth.controller'
import { AuthClientGrpc } from './auth.grpc'
import { AUTH_V1_PACKAGE_NAME } from '@ramz001-cinema/contracts/gen/auth/v1'
import { AUTH_CLIENT_TOKEN } from './auth.grpc'
import { createGrpcClient } from 'src/common/utils/create-grpc-client'

@Module({
	controllers: [AuthController],
	imports: [
		createGrpcClient(
			AUTH_CLIENT_TOKEN,
			{
				package: AUTH_V1_PACKAGE_NAME,
				protoPath: PROTO_PATHS.AUTH,
				loader: {
					includeDirs: [PROTO_ROOT]
				}
			},
			'AUTH_GRPC_URL'
		)
	],
	providers: [AuthClientGrpc]
})
export class AuthModule {}
