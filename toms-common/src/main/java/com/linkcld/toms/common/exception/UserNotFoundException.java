package com.linkcld.toms.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * rest exception for rest api
 * this will add a special errorHandler
 * 
 * @author jack
 *
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "No such user")
public class UserNotFoundException extends RuntimeException {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public UserNotFoundException() {

    }

    public UserNotFoundException(Exception e) {
        super(e);
    }

}
