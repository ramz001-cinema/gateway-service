export const ZodApiError = {
	statusCode: {
		type: 'number',
		example: 400
	},
	message: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				code: { type: 'string', example: 'invalid_type' },
				expected: { type: 'string', example: 'string' },
				path: {
					type: 'array',
					items: { type: 'string', example: 'string' }
				},
				message: { type: 'string', example: 'Required' }
			}
		}
	},
	error: {
		type: 'string',
		example: 'Bad Request'
	}
}
