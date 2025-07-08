package com.nfldb.controller;

import com.nfldb.model.Game;
import com.nfldb.repository.GameRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepository repository;
    public GameController(GameRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/search")
    public List<Game> getByTeamAndYear(@RequestParam String team, @RequestParam int year) {
        return repository.findByTeamAndYear(team, year);
    }
}
