package com.nfldb.regular_season_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegSeasonPlayerStatsRepository extends JpaRepository<RegSeasonPlayerStats, String> {
    RegSeasonPlayerStats findByPlayerIdAndSeasonYear(String playerId, Integer seasonYear);
    List<RegSeasonPlayerStats> findByTeamIdAndSeasonYear(String teamId, Integer seasonYear);
    List<RegSeasonPlayerStats> findByPlayerId(String playerId);
    List<RegSeasonPlayerStats> findBySeasonYear(Integer seasonYear);
}
