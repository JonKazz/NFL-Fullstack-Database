package com.nfldb.game_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GamePlayerStatsRepository extends JpaRepository<GamePlayerStats, String> {
    GamePlayerStats findByGameIdAndPlayerId(String gameId, String playerId);
    List<GamePlayerStats> findByGameId(String gameId);
    
    @Query("SELECT gps FROM GamePlayerStats gps JOIN GameInfo gi ON gps.gameId = gi.gameId WHERE gps.playerId = :playerId AND gi.seasonYear = :seasonYear")
    List<GamePlayerStats> findByPlayerIdAndSeasonYear(@Param("playerId") String playerId, @Param("seasonYear") String seasonYear);
}
