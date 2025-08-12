package com.nfldb.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, String> {
    Optional<Team> findFirstByTeamIdAndSeasonYear(String teamId, Integer seasonYear);
    List<Team> findBySeasonYear(Integer seasonYear);
}
