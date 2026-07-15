package com.codearena.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long problemId;

    @Column(length = 2000, nullable = false)
    private String input;

    @Column(length = 2000, nullable = false)
    private String expectedOutput;

    @Column(name = "is_sample")
    private boolean sample = false;
}
