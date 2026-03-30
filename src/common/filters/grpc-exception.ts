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

interface RawGrpcError {
	code?: number
	details?: string // ← remote gRPC errors use this
	message?: string // ← local RpcException uses this
}

@Catch(RpcException, Error) // catch both
export class GrpcExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(GrpcExceptionsFilter.name)

	catch(exception: RpcException | Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		let grpcCode = 2 // UNKNOWN fallback
		let message = 'Unknown error'
		let details: unknown = undefined

		if (exception instanceof RpcException) {
			// locally thrown GrpcException
			const error = exception.getError() as RawGrpcError | string
			if (typeof error === 'object') {
				grpcCode = error.code ?? 2
				message = error.message ?? error.details ?? 'Unknown error'
				details = error.details
			} else {
				message = error
			}
		} else {
			// raw gRPC error coming back over the wire
			const error = exception as unknown as RawGrpcError
			grpcCode = error.code ?? 2
			message = error.details ?? error.message ?? 'Unknown error'
		}

		const httpStatus = grpcToHttp(grpcCode)

		if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
			this.logger.error(`gRPC error [${grpcCode}]: ${message}`)
		}

		response.status(httpStatus).json({
			statusCode: httpStatus,
			message,
			...(details && typeof details !== 'string' ? { details } : {})
		})
	}
}
