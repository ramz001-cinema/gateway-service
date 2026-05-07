import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../guards'
import { Role } from '@ramz001-cinema/contracts/gen/account'
import { Roles } from './roles.decorator'
import { RolesGuard } from '../guards/roles.guard'

export const Protected = (...roles: Role[]) => {
	if (roles.length === 0) return applyDecorators(UseGuards(AuthGuard))

	return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard))
}
