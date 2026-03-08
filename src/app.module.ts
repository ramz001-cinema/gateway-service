import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

import { HttpExceptionFilter } from './common/filters/http-exception'
import { AuthModule } from './modules/auth/auth.module'
import { HealthModule } from './modules/health/health.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		HealthModule,
		AuthModule
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
			useClass: HttpExceptionFilter
		}
	]
})
export class AppModule {}
