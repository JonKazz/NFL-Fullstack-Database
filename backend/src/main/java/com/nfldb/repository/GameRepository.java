package com.nfldb.repository;

import com.nfldb.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, String> {
    List<Game> findByTeamAndYear(String team, int year);
}
