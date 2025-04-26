package com.example.demo.model;

import org.springframework.http.HttpStatus;

public class ResponseMessage {

    private String message;
    private Object data;
    private HttpStatus status;

    // Constructor with three parameters
    public ResponseMessage(String message, Object data, HttpStatus status) {
        this.message = message;
        this.data = data;
        this.status = status;
    }

    // Constructor with two parameters (useful when there is no data)
    public ResponseMessage(String message, HttpStatus status) {
        this.message = message;
        this.data = null;  // No data to return
        this.status = status;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }
}
