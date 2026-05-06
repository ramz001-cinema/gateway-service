import { Controller, Get } from '@nestjs/common'
import { AccountClientGrpc } from './account.grpc'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Protected } from 'src/common/decorators'
import { CurrentUser } from 'src/common/decorators'

@Controller('account')
export class AccountController {
	constructor(private readonly client: AccountClientGrpc) {}

	@Get('profile')
	@ApiOperation({
		summary: 'Get user profile',
		description:
			'Retrieve the profile information of the authenticated user'
	})
	@Protected()
	@ApiBearerAuth()
	getProfile(@CurrentUser() id: string) {
		return this.client.getProfile({ id })
	}
}
