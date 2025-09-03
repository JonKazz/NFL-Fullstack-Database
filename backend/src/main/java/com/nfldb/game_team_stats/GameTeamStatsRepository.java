package com.nfldb.game_team_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameTeamStatsRepository extends JpaRepository<GameTeamStats, String> {
    List<GameTeamStats> findByIdGameId(String gameId);
}
