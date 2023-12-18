package com.core.application.errors;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class GlobalExceptionHandler {
    ErrorMessage errorMessage = new ErrorMessage();

    // -------------------ERRO:400---------------------//
    @ExceptionHandler(HttpClientErrorException.BadRequest.class)
    public ResponseStatusException badRequestSuapAuthentication() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, "É necessário informar o login e a senha do usuário.");
    }
    // @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    // public ResponseStatusException missingData() {
    //     return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inconsistent Data");
    // }
    // -------------------Erro:401----------------------//
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(HttpClientErrorException.Unauthorized.class)
    public ResponseStatusException unauthorizedSuapAuthentication() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
    }

    // @ResponseStatus(HttpStatus.UNAUTHORIZED)
    // @ExceptionHandler(SignatureException.class)
    // public ErrorMessage wrongToken() {
    //     errorMessage.setStatus(401);
    //     errorMessage.setDetail("Invalid Token");
    //     return errorMessage;
    // }

    // @ResponseStatus(HttpStatus.UNAUTHORIZED)
    // @ExceptionHandler(ExpiredJwtException.class)
    // public ErrorMessage expiredToken() {
    //     errorMessage.setStatus(401);
    //     errorMessage.setDetail("Expired Token");
    //     return errorMessage;
    // }


    // -------------------Erro:403----------------------//
    @ExceptionHandler(HttpClientErrorException.Forbidden.class)
    public ResponseStatusException ForbiddenSuapAuthentication() {
        return new ResponseStatusException(HttpStatus.FORBIDDEN, "Tentativas excessivas de logins. Por favor efetue o login na página inicial do suap.");
    }

    // -------------------ERROR:404--------------------//
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseStatusException NoSuchElement(NoSuchElementException e) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Data Not Found!");
    }

    // -------------------ERROR:500--------------------//
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseStatusException HttpMessageNotReadable(HttpMessageNotReadableException e) {
        return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Message Not Readable");
    }

}
