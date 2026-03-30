export function describeEnum(
	enumObject: any,
	description: string = 'Available options'
): string {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const options = Object.keys(enumObject)
		.filter(key => isNaN(Number(key))) // Filter out reverse mappings
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		.map(key => `${key} (${enumObject[key]})`)
		.join(', ')

	return `${description}: ${options}`
}
