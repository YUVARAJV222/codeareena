package com.codearena.service;

import com.codearena.dto.ProblemAdminResponseDto;
import com.codearena.dto.ProblemRequestDto;
import com.codearena.entity.Problem;
import com.codearena.entity.TestCase;
import com.codearena.repository.ProblemRepository;
import com.codearena.repository.TestCaseRepository;
import com.codearena.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id: " + id));
    }

    public ProblemAdminResponseDto getProblemForAdmin(Long id) {
        Problem problem = getProblemById(id);
        List<TestCase> testCases = testCaseRepository.findByProblemId(id);
        return new ProblemAdminResponseDto(problem, testCases);
    }

    @Transactional
    public Problem createProblem(ProblemRequestDto dto) {
        Problem problem = new Problem();
        problem.setTitle(dto.getTitle());
        problem.setDescription(dto.getDescription());
        problem.setDifficulty(dto.getDifficulty());
        problem.setSampleInput(dto.getSampleInput());
        problem.setSampleOutput(dto.getSampleOutput());
        problem.setConstraints(dto.getConstraints());
        problem.setTags(dto.getTags());
        problem.setStarterCodeJava(dto.getStarterCodeJava());
        problem.setStarterCodePython(dto.getStarterCodePython());
        problem.setStarterCodeCpp(dto.getStarterCodeCpp());
        problem.setExpectedTimeComplexity(dto.getExpectedTimeComplexity());
        problem.setExpectedSpaceComplexity(dto.getExpectedSpaceComplexity());
        problem.setSolution(dto.getSolution());

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            problem.setCreatedBy(((UserPrincipal) auth.getPrincipal()).getId());
        }

        Problem savedProblem = problemRepository.save(problem);

        if (dto.getTestCases() != null) {
            for (ProblemRequestDto.TestCaseDto tcDto : dto.getTestCases()) {
                TestCase tc = new TestCase();
                tc.setProblemId(savedProblem.getId());
                tc.setInput(tcDto.getInput());
                tc.setExpectedOutput(tcDto.getExpectedOutput());
                tc.setSample(tcDto.isSample());
                testCaseRepository.save(tc);
            }
        }

        return savedProblem;
    }

    @Transactional
    public Problem updateProblem(Long id, ProblemRequestDto dto) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id: " + id));

        problem.setTitle(dto.getTitle());
        problem.setDescription(dto.getDescription());
        problem.setDifficulty(dto.getDifficulty());
        problem.setSampleInput(dto.getSampleInput());
        problem.setSampleOutput(dto.getSampleOutput());
        problem.setConstraints(dto.getConstraints());
        problem.setTags(dto.getTags());
        problem.setStarterCodeJava(dto.getStarterCodeJava());
        problem.setStarterCodePython(dto.getStarterCodePython());
        problem.setStarterCodeCpp(dto.getStarterCodeCpp());
        problem.setExpectedTimeComplexity(dto.getExpectedTimeComplexity());
        problem.setExpectedSpaceComplexity(dto.getExpectedSpaceComplexity());
        problem.setSolution(dto.getSolution());

        Problem savedProblem = problemRepository.save(problem);

        List<TestCase> oldTestCases = testCaseRepository.findByProblemId(id);
        testCaseRepository.deleteAll(oldTestCases);

        if (dto.getTestCases() != null) {
            for (ProblemRequestDto.TestCaseDto tcDto : dto.getTestCases()) {
                TestCase tc = new TestCase();
                tc.setProblemId(id);
                tc.setInput(tcDto.getInput());
                tc.setExpectedOutput(tcDto.getExpectedOutput());
                tc.setSample(tcDto.isSample());
                testCaseRepository.save(tc);
            }
        }

        return savedProblem;
    }

    @Transactional
    public void deleteProblem(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Problem not found with id: " + id));

        List<TestCase> testCases = testCaseRepository.findByProblemId(id);
        testCaseRepository.deleteAll(testCases);
        problemRepository.delete(problem);
    }
}
