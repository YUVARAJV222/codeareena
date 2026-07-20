package com.codearena.controller;

import com.codearena.dto.ProblemRequestDto;
import com.codearena.entity.Problem;
import com.codearena.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProblem(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(problemService.getProblemById(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/{id}/admin")
    public ResponseEntity<?> getProblemForAdmin(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(problemService.getProblemForAdmin(id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody ProblemRequestDto dto) {
        Problem saved = problemService.createProblem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody ProblemRequestDto dto) {
        Problem updated = problemService.updateProblem(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProblem(@PathVariable Long id) {
        try {
            problemService.deleteProblem(id);
            return ResponseEntity.ok(Map.of("message", "Problem deleted successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }
}
