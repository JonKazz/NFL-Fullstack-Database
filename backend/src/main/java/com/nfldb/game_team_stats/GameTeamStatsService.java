package com.nfldb.game_team_stats;

import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class GameTeamStatsService {
    private final GameTeamStatsRepository repository;

    public GameTeamStatsService(GameTeamStatsRepository repository) {
        this.repository = repository;
    }

    public List<GameTeamStats> getGameTeamStats(String gameId) {
        return repository.findByIdGameId(gameId);
    }
}