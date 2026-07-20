package com.codearena.dto;

import com.codearena.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemRequestDto {
    private String title;
    private String description;
    private Difficulty difficulty;
    private String sampleInput;
    private String sampleOutput;
    private String constraints;
    private String tags;
    private String starterCodeJava;
    private String starterCodePython;
    private String starterCodeCpp;
    private String expectedTimeComplexity;
    private String expectedSpaceComplexity;
    private String solution;
    private List<TestCaseDto> testCases;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestCaseDto {
        private Long id;
        private String input;
        private String expectedOutput;
        private boolean sample;
    }
}
