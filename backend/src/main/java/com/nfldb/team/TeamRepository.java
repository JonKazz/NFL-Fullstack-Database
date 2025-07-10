package com.nfldb.team;

import com.nfldb.team.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, String> {
    List<Team> findByTeamAndYear(String team, Integer year);

    Optional<Team> findFirstByTeamAndYear(String team, Integer year);
}
