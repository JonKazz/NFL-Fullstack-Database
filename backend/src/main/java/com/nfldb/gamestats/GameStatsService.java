package com.nfldb.gamestats;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameStatsService {
    private final GameStatsRepository repository;

    public GameStatsService(GameStatsRepository repository) {
        this.repository = repository;
    }

    public GameStats getGameStats(String gameId, String teamId) {
        return repository.findByIdGameIdAndIdTeamId(gameId, teamId);
    }

    public List<GameStats> getAllGameStats(String gameId) {
        return repository.findByIdGameId(gameId);
    }
}