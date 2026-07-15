package com.codearena.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "submission_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Submission submission;

    @Column(name = "test_case_id", nullable = false)
    private Long testCaseId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    private Long executionTimeMs;

    private Long memoryUsedBytes;

    @Column(length = 4000)
    private String actualOutput;

    @Column(length = 4000)
    private String errorMessage;
}
