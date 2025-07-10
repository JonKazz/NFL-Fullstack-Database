package com.nfldb.team;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class TeamService {
    private final TeamRepository repository;

    public TeamService(TeamRepository repository) {
        this.repository = repository;
    }

    public Optional<Team> getTeamInfo(String team, Integer year) {
        return repository.findFirstByTeamAndYear(team, year);
    }
}