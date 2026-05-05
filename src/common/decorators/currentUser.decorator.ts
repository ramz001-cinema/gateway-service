import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedRequest } from '../guards'

/// Custom decorator to extract the current user's ID from the request object
export const CurrentUser = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const request: AuthenticatedRequest = ctx.switchToHttp().getRequest()

		return request?.user?.id || null
	}
)
