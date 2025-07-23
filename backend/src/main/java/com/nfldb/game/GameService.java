package com.nfldb.game;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameService {
    private final GameRepository repository;

    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    public Game getGame(String gameId) {
        return repository.findByGameId(gameId);
    }

    public List<Game> getGamesByYear(String teamId, Integer seasonYear) {
        return repository.findByTeamAndSeasonYear(teamId, seasonYear);
    }
}