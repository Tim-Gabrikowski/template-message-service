export class IllegalArgumentException extends Error {
	constructor(message = "IllegalArgumentException") {
		super(message);
		this.name = "IllegalArgumentException";
	}
}

export class ConflictException extends Error {
	constructor(message = "ConflictExeption") {
		super(message);
		this.name = "ConflictException";
	}
}

export class NotFoundException extends Error {
	constructor(message = "NotFoundException") {
		super(message);
		this.name = "NotFoundException";
	}
}

export class NotAllowedExeption extends Error {
	constructor(message = "NotAllowedExeption") {
		super(message);
		this.name = "NotAllowedExeption";
	}
}

export class InternalServerError extends Error {
	constructor(message = "InternalServerError") {
		super(message);
		this.name = "InternalServerError";
	}
}
