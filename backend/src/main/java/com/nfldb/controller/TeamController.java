package com.nfldb.controller;

import com.nfldb.model.Team;
import com.nfldb.repository.TeamRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamRepository repository;
    public TeamController(TeamRepository repository) {
        this.repository = repository;
    }

   @GetMapping("/info")
    public Team getTeamInfo(@RequestParam String team, @RequestParam int year) {
        return repository.findByTeamAndYear(team, year)
                        .stream()
                        .findFirst()
                        .orElse(null);
    }
}
