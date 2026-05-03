import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { PassportService } from '@ramz001-cinema/passport'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
	user: {
		id: string
	}
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly passportService: PassportService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context
			.switchToHttp()
			.getRequest<AuthenticatedRequest>()

		const token = this.extractToken(request)

		const result = this.passportService.verify(token)

		if (!result.valid)
			throw new UnauthorizedException(result.reason || 'Invalid token')

		if (!result.userId)
			throw new UnauthorizedException('User ID is missing')

		request.user = {
			id: result.userId
		}

		return true
	}

	private extractToken(request: Request) {
		const header = request.headers['authorization']

		if (!header) {
			throw new UnauthorizedException('Authorization header is missing')
		}

		if (!header.startsWith('Bearer ')) {
			throw new UnauthorizedException(
				'Invalid authorization header format'
			)
		}
		const token = header.split(' ')[1]

		if (!token) {
			throw new UnauthorizedException('Token is missing')
		}

		return token
	}
}
