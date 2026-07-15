package com.codearena.service;

import com.codearena.dto.ProblemAdminResponseDto;
import com.codearena.dto.ProblemRequestDto;
import com.codearena.entity.Problem;
import com.codearena.entity.TestCase;
import com.codearena.repository.ProblemRepository;
import com.codearena.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
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
        Problem p = new Problem();
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setDifficulty(dto.getDifficulty());
        p.setSampleInput(dto.getSampleInput());
        p.setSampleOutput(dto.getSampleOutput());
        p.setConstraints(dto.getConstraints());
        p.setTags(dto.getTags());
        p.setStarterCodeJava(dto.getStarterCodeJava());
        p.setStarterCodePython(dto.getStarterCodePython());
        p.setStarterCodeCpp(dto.getStarterCodeCpp());
        p.setCreatedBy(1L);

        Problem savedProblem = problemRepository.save(p);

        if (dto.getTestCases() != null) {
            for (TestCase tc : dto.getTestCases()) {
                tc.setId(null);
                tc.setProblemId(savedProblem.getId());
                testCaseRepository.save(tc);
            }
        }

        return savedProblem;
    }

    @Transactional
    public Problem updateProblem(Long id, ProblemRequestDto dto) {
        Problem p = getProblemById(id);
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setDifficulty(dto.getDifficulty());
        p.setSampleInput(dto.getSampleInput());
        p.setSampleOutput(dto.getSampleOutput());
        p.setConstraints(dto.getConstraints());
        p.setTags(dto.getTags());
        p.setStarterCodeJava(dto.getStarterCodeJava());
        p.setStarterCodePython(dto.getStarterCodePython());
        p.setStarterCodeCpp(dto.getStarterCodeCpp());

        Problem savedProblem = problemRepository.save(p);

        List<TestCase> existing = testCaseRepository.findByProblemId(id);
        testCaseRepository.deleteAll(existing);

        if (dto.getTestCases() != null) {
            for (TestCase tc : dto.getTestCases()) {
                tc.setId(null);
                tc.setProblemId(id);
                testCaseRepository.save(tc);
            }
        }

        return savedProblem;
    }

    @Transactional
    public void deleteProblem(Long id) {
        Problem p = getProblemById(id);
        List<TestCase> existing = testCaseRepository.findByProblemId(id);
        testCaseRepository.deleteAll(existing);
        problemRepository.delete(p);
    }
}
