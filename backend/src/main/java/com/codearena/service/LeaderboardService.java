package com.codearena.service;

import com.codearena.entity.User;
import com.codearena.repository.LeaderboardEntryRepository;
import com.codearena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final UserRepository userRepository;

    public record LeaderboardEntry(Long userId, String name, long solvedCount, int rank) {}

    /**
     * Score = number of DISTINCT problems solved (status = ACCEPTED) per user.
     * Fetches from cached database entries pre-sorted by solved count, accuracy and speed.
     */
    public List<LeaderboardEntry> getLeaderboard() {
        List<com.codearena.entity.LeaderboardEntry> dbEntries = leaderboardEntryRepository.findAllByOrderBySolvedCountDescAccuracyDescTotalTimeMsAsc();
        List<LeaderboardEntry> result = new ArrayList<>();
        int rank = 1;
        for (com.codearena.entity.LeaderboardEntry entry : dbEntries) {
            User user = userRepository.findById(entry.getUserId()).orElse(null);
            String name = user != null ? user.getName() : "Unknown";
            result.add(new LeaderboardEntry(entry.getUserId(), name, entry.getSolvedCount(), rank++));
        }
        return result;
    }
}
