class DatabaseInsertError extends Error {
	constructor(message: string) {
		super(message)
	}
}

export { DatabaseInsertError }
