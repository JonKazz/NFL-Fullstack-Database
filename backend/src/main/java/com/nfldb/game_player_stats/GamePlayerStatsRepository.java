package com.nfldb.game_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GamePlayerStatsRepository extends JpaRepository<GamePlayerStats, String> {
    GamePlayerStats findByIdGameIdAndIdPlayerId(String gameId, String playerId);
    List<GamePlayerStats> findByIdGameId(String gameId);
    List<GamePlayerStats> findByIdPlayerId(String playerId);
}
