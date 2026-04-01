import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { PROTO_PATHS } from '@ramz001-cinema/contracts'
import { AuthController } from './auth.controller'
import { AuthClientGrpc } from './auth.grpc'

@Module({
	controllers: [AuthController],
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'AUTH_PACKAGE',
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: 'auth.v1',
						protoPath: PROTO_PATHS.AUTH,
						url: configService.getOrThrow<string>('AUTH_GRPC_URL')
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	providers: [AuthClientGrpc]
})
export class AuthModule {}
