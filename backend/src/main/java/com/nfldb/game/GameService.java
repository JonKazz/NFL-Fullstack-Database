package com.nfldb.game;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameService {
    private final GameRepository repository;

    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    public Game getGame(String gameId, String teamId) {
        return repository.findByIdGameIdAndIdTeamId(gameId, teamId);
    }

    public List<Game> getGamesByYear(String team, Integer year) {
        return repository.findByIdTeamIdAndYear(team, year);
    }
}