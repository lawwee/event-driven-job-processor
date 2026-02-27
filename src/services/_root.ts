import Joi from "joi";

export class RootService {
    constructor() {};

    process_successful_response(payload: any, code = 200) {
        return {
            success: true,
            payload,
            statusCode: code,
            error: null
        };
    };

    process_failed_response(message: any, payload?: any, code = 400) {
        return {
            success: false,
            error: message,
            payload: payload || null,
            statusCode: code
        };
    };

    handle_validation_errors(error: Joi.ValidationError) {
        if (error) {
            const errorDetails = error.details.map((detail: any) => detail.message.replace(/\"/g, ""));

            return this.process_failed_response(
                "Validation failed",
                errorDetails,
                422
            );
        };
    };
};