import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedRequest } from '../guards'
import { userId } from '../config/validator'

/// Custom decorator to extract the current user's ID from the request object
export const CurrentUser = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const request: AuthenticatedRequest = ctx.switchToHttp().getRequest()

		const user_id = request?.user?.id

		if (!user_id) {
			return null
		}

		return userId.parse(request?.user?.id)
	}
)
