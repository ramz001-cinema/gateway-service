import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { EnvType } from '../config'

export function createGrpcClient(
	name: string | symbol,
	options: GrpcOptions['options'],
	url: keyof EnvType
) {
	return ClientsModule.registerAsync([
		{
			name,
			useFactory: (configService: ConfigService) => ({
				transport: Transport.GRPC,
				options: {
					...options,
					url: configService.getOrThrow<string>(url)
				}
			}),
			inject: [ConfigService]
		}
	])
}
