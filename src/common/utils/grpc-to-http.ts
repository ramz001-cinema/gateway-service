import { status } from '@grpc/grpc-js'
import { HttpStatus } from '@nestjs/common'

export const GRPC_TO_HTTP: Record<number, HttpStatus> = {
	[status.OK]: HttpStatus.OK,
	[status.CANCELLED]: HttpStatus.BAD_REQUEST, // 400
	[status.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR, // 500
	[status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST, // 400
	[status.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT, // 504
	[status.NOT_FOUND]: HttpStatus.NOT_FOUND, // 404
	[status.ALREADY_EXISTS]: HttpStatus.CONFLICT, // 409
	[status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN, // 403
	[status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED, // 401
	[status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS, // 429
	[status.FAILED_PRECONDITION]: HttpStatus.UNPROCESSABLE_ENTITY, // 422
	[status.ABORTED]: HttpStatus.CONFLICT, // 409
	[status.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST, // 400
	[status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED, // 501
	[status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR, // 500
	[status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE, // 503
	[status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR // 500
}

export function grpcToHttp(grpcCode: number): HttpStatus {
	return GRPC_TO_HTTP[grpcCode] ?? HttpStatus.INTERNAL_SERVER_ERROR
}
