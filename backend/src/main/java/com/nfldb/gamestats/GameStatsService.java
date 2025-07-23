package com.nfldb.gamestats;

import org.springframework.stereotype.Service;

@Service
public class GameStatsService {
    private final GameStatsRepository repository;

    public GameStatsService(GameStatsRepository repository) {
        this.repository = repository;
    }

    public GameStats getGameStats(String gameId, String teamId) {
        return repository.findByIdGameIdAndIdTeamId(gameId, teamId);
    }
}