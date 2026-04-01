import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { cleanupOpenApiDoc } from 'nestjs-zod'

export function setupSwagger(app: INestApplication) {
	// Swagger/OpenAPI document configuration
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Cinema Gateway API')
		.setDescription('API docs for Cinema Gateway')
		.setVersion('1.0.0')
		.addBearerAuth() // JWT authentication
		.build()

	// Create and clean OpenAPI document
	const openApiDoc = SwaggerModule.createDocument(app, swaggerConfig)
	const cleanedDoc = cleanupOpenApiDoc(openApiDoc)

	// Setup Swagger UI
	SwaggerModule.setup('openapi', app, cleanedDoc, {
		swaggerOptions: { persistAuthorization: true }
	})

	// Setup scalar apiReference at /docs
	app.use('/docs', apiReference({ content: cleanedDoc, theme: 'deepSpace' }))
}
