import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator
} from '@nestjs/terminus'

@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator
	) {}

	@ApiOperation({
		summary: 'Check the health of the gateway service',
		description:
			'Returns the health status of the gateway service and its dependencies.'
	})
	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			() => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')
		])
	}
}
