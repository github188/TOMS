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
@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "运行时异常")
public class LinkcldRuntimeException extends RuntimeException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public LinkcldRuntimeException() {

    }
    public LinkcldRuntimeException(String msg) {
        super(msg);
    }
    public LinkcldRuntimeException(Exception e) {
        super(e);
    }

}
