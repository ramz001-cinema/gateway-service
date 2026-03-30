import {
	Catch,
	ArgumentsHost,
	ExceptionFilter,
	Logger,
	HttpStatus
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Response } from 'express'
import { grpcToHttp } from '../utils/grpc-to-http'

interface GrpcError {
	code?: number
	message?: string
	details?: unknown
}

@Catch(RpcException)
export class GrpcExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(GrpcExceptionsFilter.name)

	catch(exception: RpcException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		const error = exception.getError() as GrpcError | string

		// RpcException can be thrown with a plain string too
		const grpcCode = typeof error === 'object' ? (error.code ?? 2) : 2
		const message =
			typeof error === 'object'
				? (error.message ?? 'Unknown error')
				: error
		const details = typeof error === 'object' ? error.details : undefined

		const httpStatus = grpcToHttp(grpcCode)

		if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
			this.logger.error(`gRPC error [${grpcCode}]: ${message}`)
		}

		response.status(httpStatus).json({
			statusCode: httpStatus,
			message,
			...(details ? { details } : {})
		})
	}
}
