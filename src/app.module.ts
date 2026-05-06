import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

import { AuthModule } from './modules/auth/auth.module'
import { HealthModule } from './modules/health/health.module'
import { GlobalExceptionsFilter } from './common/filters/global-exception'
import { validateEnv } from './common/config'
import { PassportModule } from '@ramz001-cinema/passport'
import { ConfigService } from '@nestjs/config'
import { EnvType } from './common/config'
import { AccountModule } from './modules/account/account.module'
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: validateEnv
		}),
		HealthModule,
		AuthModule,
		PassportModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<EnvType>) => ({
				secretKey: configService.getOrThrow<string>(
					'PASSPORT_SECRET_KEY'
				)
			})
		}),
		AccountModule
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor
		},
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionsFilter
		}
	]
})
export class AppModule {}
