package com.nfldb.regular_season_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegSeasonPlayerStatsRepository extends JpaRepository<RegSeasonPlayerStats, RegSeasonPlayerStatsId> {
    RegSeasonPlayerStats findByIdPlayerIdAndIdSeasonYear(String playerId, Integer seasonYear);
    List<RegSeasonPlayerStats> findByIdTeamIdAndIdSeasonYear(String teamId, Integer seasonYear);
}
