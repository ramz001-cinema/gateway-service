import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Response } from 'express'
import { grpcToHttp } from '../utils/grpc-to-http'
import { ServiceError, status as GrpcStatus } from '@grpc/grpc-js'

@Catch()
export class GlobalExceptionsFilter extends BaseExceptionFilter {
	private isGrpcError(exception: unknown): exception is ServiceError {
		return (
			typeof exception === 'object' &&
			exception !== null &&
			'code' in exception &&
			'details' in exception &&
			Object.values(GrpcStatus).includes((exception as ServiceError).code)
		)
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		if (this.isGrpcError(exception)) {
			const httpStatus =
				grpcToHttp(exception.code) || HttpStatus.INTERNAL_SERVER_ERROR

			return response.status(httpStatus).json({
				statusCode: httpStatus,
				message: exception.details || 'gRPC error occurred'
			})
		}

		if (exception instanceof HttpException) {
			const status = exception.getStatus()

			return response.status(status).json(
				exception.getResponse() instanceof Object
					? exception.getResponse()
					: {
							statusCode: status,
							message: exception.message
						}
			)
		}

		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'An unexpected error occurred'
		})
	}
}
