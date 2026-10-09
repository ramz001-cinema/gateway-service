import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { join } from 'node:path'
import { cleanupOpenApiDoc } from 'nestjs-zod'

// Shipped in dist/assets by the nest-cli "assets" config, so the path holds in the prod image
// (which copies only dist). __dirname is dist/src/common/config/global at runtime.
const DOCS_HTML = join(__dirname, '..', '..', '..', '..', 'assets', 'docs.html')

export function setupSwagger(app: INestApplication) {
	// Swagger/OpenAPI document configuration.
	// OpenAPI 3.1 is emitted natively — Stoplight Elements requires it, and there is no
	// post-processing step. (3.0 would need `@scalar/openapi-upgrader`; 3.1 does not.)
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Cinema Gateway API')
		.setDescription('API docs for Cinema Gateway')
		.setVersion('1.0.0')
		.setOpenAPIVersion('3.1.0')
		.addBearerAuth() // JWT authentication
		.build()

	// Create and clean the OpenAPI document (3.1 natively, per setOpenAPIVersion above)
	const openApiDoc = SwaggerModule.createDocument(app, swaggerConfig)
	const cleanedDoc = cleanupOpenApiDoc(openApiDoc)

	// Serve the OpenAPI document for the docs UI and other tooling
	app.use('/api/openapi.json', (_req: Request, res: Response) =>
		res.json(cleanedDoc)
	)

	// Swagger UI (raw OpenAPI spec, kept for tooling)
	SwaggerModule.setup('api/openapi', app, cleanedDoc, {
		swaggerOptions: { persistAuthorization: true }
	})

	// Stoplight Elements: modern docs UI with an inline Try It panel (no modal).
	// `no-cache` means revalidate, not "don't store" — with the ETag sendFile sets, an unchanged
	// page is a cheap 304, and an edited docs.html is never served stale.
	app.use('/api/docs', (_req: Request, res: Response) =>
		res.sendFile(DOCS_HTML, {
			headers: { 'Cache-Control': 'no-cache' }
		})
	)
}
