package com.nfldb.game;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, GameId> {
    List<Game> findByIdTeamIdAndYear(String team, Integer year);
}
