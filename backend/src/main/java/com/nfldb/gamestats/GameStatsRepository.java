package com.nfldb.gamestats;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GameStatsRepository extends JpaRepository<GameStats, String> {
    GameStats findByIdGameIdAndIdTeamId(String gameId, String teamId);
}
