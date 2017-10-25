package com.linkcld.toms.common.exception;

import com.linkcld.fw.core.exception.ErrorResponse;
import com.linkcld.fw.core.exception.RestException;
import com.linkcld.fw.utils.mapper.JsonMapper;
import com.linkcld.fw.utils.web.MediaTypes;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
@Slf4j
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger logger = LogManager.getLogger(RestExceptionHandler.class);
    private JsonMapper jsonMapper = new JsonMapper();

    @ExceptionHandler(value = { RestException.class })
    public ResponseEntity<Object> handlerNotFoundException(RestException ex, WebRequest webRequest,
            HttpServletRequest request) {

        logger.error(ex.getMessage(), ex);
        ErrorResponse errorResponse = new ErrorResponse(ex, request);

        String body = jsonMapper.toJson(errorResponse);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(MediaTypes.TEXT_PLAIN_UTF_8));

        return handleExceptionInternal(ex, body, headers, ex.status, webRequest);
    }

}
