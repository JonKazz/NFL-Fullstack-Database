package com.nfldb.game;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameService {
    private final GameRepository repository;

    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    public List<Game> getGamesByTeamAndYear(String team, Integer year) {
        return repository.findByTeamAndYear(team, year);
    }
}