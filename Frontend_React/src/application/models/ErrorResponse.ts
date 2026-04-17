import { ErrorMessage } from "@infrastructure/apis/client";

/**
 * ErrorResponse should be used to get the error from a error response.
 */
export type ErrorResponse = {
    errorMessage: ErrorMessage
}