import { Body, Controller, Get, Post } from '@nestjs/common'
import { AccountClientGrpc } from './account.grpc'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Protected } from 'src/common/decorators'
import { CurrentUser } from 'src/common/decorators'
import { ConfirmContactChangeDto, InitContactChangeDto } from './dto'

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

	@Post('contact-change/init')
	@ApiOperation({
		summary: 'Initiate contact change',
		description:
			"Initiate the process of changing the user's contact information (email or phone). This will send a verification code to the new contact method."
	})
	@Protected()
	@ApiBearerAuth()
	initContactChange(@Body() dto: InitContactChangeDto) {
		return this.client.initContactChange({ ...dto })
	}

	@Post('contact-change/confirm')
	@ApiOperation({
		summary: 'Confirm contact change',
		description:
			'Confirm the contact change by providing the OTP sent to the new contact method.'
	})
	@Protected()
	@ApiBearerAuth()
	confirmContactChange(@Body() dto: ConfirmContactChangeDto) {
		return this.client.confirmContactChange({ ...dto })
	}
}
