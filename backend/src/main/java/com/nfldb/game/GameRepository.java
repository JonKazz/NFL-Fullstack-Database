package com.nfldb.game;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, String> {
    Game findByGameId(String gameId);

    @Query("SELECT g FROM Game g WHERE (g.homeTeamId = :teamId OR g.awayTeamId = :teamId) AND g.seasonYear = :seasonYear")
    List<Game> findByTeamAndSeasonYear(@Param("teamId") String teamId, @Param("seasonYear") Integer seasonYear);
}
