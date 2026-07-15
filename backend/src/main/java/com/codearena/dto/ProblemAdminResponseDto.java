package com.codearena.dto;

import com.codearena.entity.Problem;
import com.codearena.entity.TestCase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemAdminResponseDto {
    private Problem problem;
    private List<TestCase> testCases;
}
