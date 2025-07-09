package com.nfldb.repository;

import com.nfldb.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, String> {
    List<Team> findByTeamAndYear(String team, int year);
}
