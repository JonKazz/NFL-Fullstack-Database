package com.nfldb.game_player_stats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GamePlayerStatsRepository extends JpaRepository<GamePlayerStats, String> {
    GamePlayerStats findByIdGameIdAndIdPlayerId(String gameId, String playerId);
    List<GamePlayerStats> findByIdGameId(String gameId);
    
    List<GamePlayerStats> findByTeamIdAndIdGameIdStartingWith(String teamId, String year);
    
    @Query("SELECT p.id.playerId as playerId, p.teamId as teamId, p.pos as position, " +
           "SUM(p.passYds) as totalPassYds, SUM(p.passTd) as totalPassTd, SUM(p.passInt) as totalPassInt, " +
           "SUM(p.rushYds) as totalRushYds, SUM(p.rushTd) as totalRushTd, " +
           "SUM(p.rec) as totalRec, SUM(p.recYds) as totalRecYds, SUM(p.recTd) as totalRecTd, " +
           "SUM(p.sacks) as totalSacks, SUM(p.tacklesCombined) as totalTackles, " +
           "SUM(p.defInt) as totalDefInt, SUM(p.passDefended) as totalPassDefended, " +
           "SUM(p.fumblesForced) as totalFumblesForced, " +
           "SUM(p.fgm) as totalFgm, SUM(p.fga) as totalFga, " +
           "SUM(p.xpm) as totalXpm, SUM(p.xpa) as totalXpa, " +
           "SUM(p.punt) as totalPunt, SUM(p.puntYds) as totalPuntYds " +
           "FROM GamePlayerStats p " +
           "WHERE p.teamId = :teamId AND p.id.gameId LIKE :year% " +
           "GROUP BY p.id.playerId, p.teamId, p.pos")
    List<Object> findAggregatedStatsByTeamAndYear(@Param("teamId") String teamId, @Param("year") String year);
}
