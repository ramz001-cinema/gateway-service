import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

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
						protoPath:
							'node_modules/@ramz001-cinama/contracts/proto/auth.proto',
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
