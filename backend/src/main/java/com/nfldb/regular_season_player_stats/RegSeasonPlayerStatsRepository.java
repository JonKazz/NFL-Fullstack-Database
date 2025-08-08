package com.nfldb.regular_season_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RegSeasonPlayerStatsRepository extends JpaRepository<RegSeasonPlayerStats, RegSeasonPlayerStatsId> {
    RegSeasonPlayerStats findByIdPlayerIdAndIdSeasonYear(String playerId, Integer seasonYear);
}
