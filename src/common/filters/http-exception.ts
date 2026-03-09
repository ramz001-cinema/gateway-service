import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ZodSerializationException } from 'nestjs-zod'
import { ZodError } from 'zod'

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		if (exception instanceof ZodSerializationException) {
			const zodError = exception.getZodError()
			if (zodError instanceof ZodError) {
				Logger.error(
					`ZodSerializationException: ${zodError.message}`,
					HttpExceptionFilter.name
				)
			}
		}

		super.catch(exception, host)
	}
}
