package com.codearena.dto;

import com.codearena.entity.Difficulty;
import com.codearena.entity.TestCase;
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
    private List<TestCase> testCases;
}
