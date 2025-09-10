package com.nfldb.gameinfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GameInfoRepository extends JpaRepository<GameInfo, String> {
    GameInfo findByGameId(String gameId);

    @Query("SELECT g FROM GameInfo g WHERE (g.homeTeamId = :teamId OR g.awayTeamId = :teamId) AND g.seasonYear = :seasonYear")
    List<GameInfo> findByTeamAndSeasonYear(@Param("teamId") String teamId, @Param("seasonYear") Integer seasonYear);

    @Query("SELECT g FROM GameInfo g WHERE g.seasonYear = :seasonYear AND g.playoffGame IS NOT NULL ORDER BY g.seasonWeek")
    List<GameInfo> findPlayoffGamesBySeason(@Param("seasonYear") Integer seasonYear);
    
    @Query("SELECT COUNT(g) FROM GameInfo g")
    Long countAllGameInfo();
    
    boolean existsByGameId(String gameId);
}
