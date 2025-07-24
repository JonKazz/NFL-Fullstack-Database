package com.nfldb.gamestats;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameStatsRepository extends JpaRepository<GameStats, String> {
    GameStats findByIdGameIdAndIdTeamId(String gameId, String teamId);
    List<GameStats> findByIdGameId(String gameId);
}
