package com.example.demo.controller;


import com.example.demo.dto.ProgressDTO;
import com.example.demo.exception.ProgressNotFoundException;
import com.example.demo.model.Progress;
import com.example.demo.model.ResponseMessage;
import com.example.demo.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService; // Injects the ProgressService to handle business logic

    @PostMapping("/add")
    public ResponseEntity<ResponseMessage> createProgress(@RequestBody ProgressDTO progressDTO) {
        // Call the service to add new progress
        progressService.addProgress(progressDTO);

        // Create and return a success response with HTTP 201 (Created)
        ResponseMessage responseMessage = new ResponseMessage("Progress successfully added.", HttpStatus.CREATED);
        return new ResponseEntity<>(responseMessage, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ResponseMessage> updateProgress(@PathVariable String id, @RequestBody ProgressDTO progressDTO) {
        // Check if the progress with given ID exists; throw 404 if not found
        progressService.getProgressById(id).orElseThrow(() -> new ProgressNotFoundException(id));

        // Call the service to update progress
        progressService.updateProgress(id, progressDTO);

        // Return a success message with HTTP 200 (OK)
        ResponseMessage responseMessage = new ResponseMessage("Progress with ID: " + id + " successfully updated.", HttpStatus.OK);
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Progress>> getAllProgress() {
        // Fetch all progress entries
        List<Progress> progressList = progressService.getProgress();

        // Return the list with HTTP 200 (OK)
        return new ResponseEntity<>(progressList, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Progress> getProgressById(@PathVariable String id) {
        // Try to fetch progress by ID, throw 404 if not found
        Progress progress = progressService.getProgressById(id)
                .orElseThrow(() -> new ProgressNotFoundException(id));

        // Return the progress object with HTTP 200 (OK)
        return new ResponseEntity<>(progress, HSttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> deleteProgress(@PathVariable String id) {
        // Check if progress exists before deletion
        progressService.getProgressById(id).orElseThrow(() -> new ProgressNotFoundException(id));

        // Call the service to delete the progress entry
        progressService.deleteProgress(id);

        // Return a success message with HTTP 204 (No Content)
        ResponseMessage responseMessage = new ResponseMessage("Progress with ID: " + id + " successfully deleted.", HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(responseMessage, HttpStatus.NO_CONTENT);
    }
}
