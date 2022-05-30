import Joi from 'joi';
import { Response } from 'express';

class GeneralError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }

    getCode() {
        if (this instanceof BadRequest) {
            return 400;
        }
        if (this instanceof Unathorized) {
            return 401;
        }
        if (this instanceof Forbidden) {
            return 403;
        }
        if (this instanceof NotFound) {
            return 404;
        }
        if (this instanceof Conflict) {
            return 404;
        }
        return 500;
    }

    static handle(err: any, res: Response) {
        if (err instanceof Joi.ValidationError) {
            return res.status(400).json({
                success: false,
                data: err.message,
            });
        }

        if (err instanceof GeneralError) {
            return res.status(err.getCode()).json({
                success: false,
                data: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            data: err.message,
        });
    }
}

export default GeneralError;

export class BadRequest extends GeneralError {}
export class Unathorized extends GeneralError {}
export class Forbidden extends GeneralError {}
export class NotFound extends GeneralError {}
export class Conflict extends GeneralError {}
