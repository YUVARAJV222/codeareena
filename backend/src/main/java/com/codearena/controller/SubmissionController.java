package com.codearena.controller;

import com.codearena.dto.SubmissionRequest;
import com.codearena.dto.CheckResponse;
import com.codearena.entity.Submission;
import com.codearena.security.UserPrincipal;
import com.codearena.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submit(@AuthenticationPrincipal UserPrincipal principal,
                                              @Valid @RequestBody SubmissionRequest request) {
        Submission result = submissionService.submit(principal.getId(), request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/check")
    public ResponseEntity<CheckResponse> check(@Valid @RequestBody SubmissionRequest request) {
        CheckResponse result = submissionService.check(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Submission>> mySubmissions(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(submissionService.getSubmissionsForUser(principal.getId()));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<Submission>> submissionsForProblem(@PathVariable Long problemId) {
        return ResponseEntity.ok(submissionService.getSubmissionsForProblem(problemId));
    }
}
