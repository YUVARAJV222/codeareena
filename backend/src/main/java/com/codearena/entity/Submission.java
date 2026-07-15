package com.codearena.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long problemId;

    @Lob
    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String language; // PYTHON3 (Milestone 1 supports Python only)

    // ---- Result fields (Submission Result, kept inline for Milestone 1 simplicity) ----
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.PENDING; // ACCEPTED, WRONG_ANSWER, TLE, RUNTIME_ERROR, PENDING

    @Column(length = 4000)
    private String output;

    private Long executionTimeMs;

    private LocalDateTime submittedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<SubmissionResult> testCaseResults = new java.util.ArrayList<>();
}
