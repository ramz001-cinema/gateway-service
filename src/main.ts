import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { setupSwagger } from './common/config'

import { AppModule } from './app.module'
import { getCorsConfig } from './common/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const logger = new Logger('Bootstrap')

	app.enableCors(getCorsConfig(config))
	setupSwagger(app)

	const port = config.getOrThrow<string>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	await app.listen(port)
	logger.log(`Gateway service is running on ${host}`)
	logger.log(`Swagger UI is available at ${host}/docs`)
}
void bootstrap()
