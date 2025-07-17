package com.nfldb.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, String> {
    Optional<Team> findFirstByTeamIdAndYear(String teamId, Integer year);
}
