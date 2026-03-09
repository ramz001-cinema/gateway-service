import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { cleanupOpenApiDoc } from 'nestjs-zod'

import { AppModule } from './app.module'
import { getCorsConfig } from './common/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const logger = new Logger('Bootstrap')

	app.enableCors(getCorsConfig(config))

	const swaggerConfig = new DocumentBuilder()
		.setTitle('TeaCinema Gateway API')
		.setDescription('API docs')
		.setVersion('1.0.0')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig)

	SwaggerModule.setup('openapi', app, cleanupOpenApiDoc(document), {
		swaggerOptions: { persistAuthorization: true }
	})

	const port = config.getOrThrow<string>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	app.use('/docs', apiReference({ content: document, theme: 'deepSpace' }))

	await app.listen(port)
	logger.log(`Gateway service is running on ${host}`)
	logger.log(`Swagger UI is available at ${host}/docs`)
}
void bootstrap()
