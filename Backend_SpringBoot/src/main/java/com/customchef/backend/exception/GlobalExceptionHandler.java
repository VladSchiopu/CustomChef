package com.customchef.backend.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({BadRequestException.class})
    public ResponseEntity<ErrorObject> handleBadRequest(RuntimeException ex, WebRequest request) {
        ErrorObject errorObject = new ErrorObject();

        errorObject
                .setStatusCode(HttpStatus.BAD_REQUEST.value())
                .setMessage(ex.getMessage())
                .setTimestamp(LocalDateTime.now());
        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({InternalServerErrorException.class})
    public ResponseEntity<ErrorObject> handleInternalServerError(RuntimeException ex, WebRequest request) {
        ErrorObject errorObject = new ErrorObject();

        errorObject
                .setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .setMessage(ex.getMessage())
                .setTimestamp(LocalDateTime.now());
        return new ResponseEntity<>(errorObject, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
