package com.nfldb.game_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GamePlayerStatsRepository extends JpaRepository<GamePlayerStats, String> {
    GamePlayerStats findByIdGameIdAndIdPlayerId(String gameId, String playerId);
    List<GamePlayerStats> findByIdGameId(String gameId);
}
