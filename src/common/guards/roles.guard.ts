import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators'
import { AuthenticatedRequest } from './auth.guard'
import { lastValueFrom } from 'rxjs'
import { AccountClientGrpc } from 'src/modules/account/account.grpc'
import { Role } from '@ramz001-cinema/contracts/gen/common/v1'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly accountClient: AccountClientGrpc
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		)

		if (!requiredRoles) {
			return true
		}

		const request = context
			.switchToHttp()
			.getRequest<AuthenticatedRequest>()

		const user = request.user

		if (!user?.id) throw new ForbiddenException('User context is missing')

		const account = await lastValueFrom(
			this.accountClient.getProfile({ id: user.id })
		)

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		if (!requiredRoles.includes(account.role)) {
			throw new ForbiddenException('Insufficient permissions')
		}

		return true
	}
}
