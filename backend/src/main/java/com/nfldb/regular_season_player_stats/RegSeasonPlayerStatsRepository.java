package com.nfldb.regular_season_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RegSeasonPlayerStatsRepository extends JpaRepository<RegSeasonPlayerStats, String> {
    RegSeasonPlayerStats findByPlayerIdAndSeasonYear(String playerId, Integer seasonYear);
    List<RegSeasonPlayerStats> findByTeamIdAndSeasonYear(String teamId, Integer seasonYear);
    List<RegSeasonPlayerStats> findBySeasonYear(Integer seasonYear);
    
    @Query("SELECT DISTINCT r.seasonYear FROM RegSeasonPlayerStats r WHERE r.playerId = :playerId ORDER BY r.seasonYear DESC")
    List<Integer> findDistinctSeasonYearsByPlayerId(@Param("playerId") String playerId);
}
