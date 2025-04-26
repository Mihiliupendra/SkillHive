package com.example.demo.exception;

public class ProgressNotFoundException extends RuntimeException {
    public ProgressNotFoundException(String id) {
        super("Progress not found with ID: " + id);
    }
}
