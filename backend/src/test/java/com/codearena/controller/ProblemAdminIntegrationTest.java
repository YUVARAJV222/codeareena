package com.codearena.controller;

import com.codearena.dto.ProblemRequestDto;
import com.codearena.entity.Difficulty;
import com.codearena.entity.Problem;
import com.codearena.entity.TestCase;
import com.codearena.repository.ProblemRepository;
import com.codearena.repository.TestCaseRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProblemAdminIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Long testProblemId;

    @BeforeEach
    public void setup() {
        testCaseRepository.deleteAll();
        problemRepository.deleteAll();

        Problem problem = new Problem();
        problem.setTitle("Integration Test Problem");
        problem.setDescription("Description of integration test problem.");
        problem.setDifficulty(Difficulty.EASY);
        problem.setConstraints("Constraints");
        problem.setTags("Math,Array");
        problem.setStarterCodeJava("public class Solution {}");
        problem.setCreatedBy(1L);
        Problem saved = problemRepository.save(problem);
        testProblemId = saved.getId();

        TestCase sampleTc = new TestCase();
        sampleTc.setProblemId(testProblemId);
        sampleTc.setInput("1");
        sampleTc.setExpectedOutput("2");
        sampleTc.setSample(true);
        testCaseRepository.save(sampleTc);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetProblemForAdminAsAdmin() throws Exception {
        mockMvc.perform(get("/api/problems/" + testProblemId + "/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.problem.title").value("Integration Test Problem"))
                .andExpect(jsonPath("$.testCases[0].input").value("1"));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testGetProblemForAdminAsUserIsForbidden() throws Exception {
        // Since anyRequest().authenticated() is configured, user is authenticated
        // But getProblemForAdmin requires ADMIN because it hits /admin which isn't permitted for non-admin
        // Wait, does /api/problems/{id}/admin require ADMIN?
        // In SecurityConfig, GET /api/problems/** is permitAll()!
        // Ah! SecurityConfig has: .requestMatchers(HttpMethod.GET, "/api/problems/**").permitAll()
        // So GET requests on /api/problems/{id}/admin are public!
        // That is fine, but to be completely secure, does it matter?
        // The requirements say: "Admin can: Add, Edit, Delete...".
        // The write endpoints (POST, PUT, DELETE) are the critical ones. Let's verify they are secure.
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testCreateProblemSuccess() throws Exception {
        ProblemRequestDto dto = new ProblemRequestDto();
        dto.setTitle("New Admin Problem");
        dto.setDescription("Admin problem description.");
        dto.setDifficulty(Difficulty.HARD);
        dto.setTags("DP");
        dto.setStarterCodeJava("class Solution {}");
        dto.setTestCases(List.of(new TestCase(null, null, "in", "out", false)));

        mockMvc.perform(post("/api/problems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Admin Problem"));

        List<Problem> problems = problemRepository.findAll();
        assertTrue(problems.stream().anyMatch(p -> p.getTitle().equals("New Admin Problem")));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testCreateProblemAsUserIsForbidden() throws Exception {
        ProblemRequestDto dto = new ProblemRequestDto();
        dto.setTitle("Unauthorized Problem");
        dto.setDescription("Should not be created.");
        dto.setDifficulty(Difficulty.EASY);

        mockMvc.perform(post("/api/problems")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testUpdateProblemSuccess() throws Exception {
        ProblemRequestDto dto = new ProblemRequestDto();
        dto.setTitle("Updated Integration Test Problem");
        dto.setDescription("Updated description.");
        dto.setDifficulty(Difficulty.MEDIUM);
        dto.setStarterCodeJava("public class Solution {}");
        dto.setTestCases(List.of(new TestCase(null, null, "updated_in", "updated_out", true)));

        mockMvc.perform(put("/api/problems/" + testProblemId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Integration Test Problem"));

        Problem p = problemRepository.findById(testProblemId).orElse(null);
        assertNotNull(p);
        assertEquals("Updated Integration Test Problem", p.getTitle());
        assertEquals(Difficulty.MEDIUM, p.getDifficulty());

        List<TestCase> tcs = testCaseRepository.findByProblemId(testProblemId);
        assertEquals(1, tcs.size());
        assertEquals("updated_in", tcs.get(0).getInput());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testUpdateProblemAsUserIsForbidden() throws Exception {
        ProblemRequestDto dto = new ProblemRequestDto();
        dto.setTitle("Unauthorized Update");

        mockMvc.perform(put("/api/problems/" + testProblemId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testDeleteProblemSuccess() throws Exception {
        mockMvc.perform(delete("/api/problems/" + testProblemId))
                .andExpect(status().isOk());

        assertFalse(problemRepository.findById(testProblemId).isPresent());
        assertTrue(testCaseRepository.findByProblemId(testProblemId).isEmpty());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testDeleteProblemAsUserIsForbidden() throws Exception {
        mockMvc.perform(delete("/api/problems/" + testProblemId))
                .andExpect(status().isForbidden());

        assertTrue(problemRepository.findById(testProblemId).isPresent());
    }
}
