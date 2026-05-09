import { SetMetadata } from '@nestjs/common'
import { Role } from '@ramz001-cinema/contracts/gen/common/v1'

export const ROLES_KEY = Symbol('roles')

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
