package com.nfldb.game_drives;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GameDrivesRepository extends JpaRepository<GameDrives, Long> {
    
    // Find all drives for a specific game
    List<GameDrives> findByGameId(String gameId);
    
    // Find all drives for a specific team in a specific game
    List<GameDrives> findByGameIdAndTeamId(String gameId, String teamId);
    
    // Find drives by quarter for a specific game
    List<GameDrives> findByGameIdAndQuarter(String gameId, String quarter);
    
    // Find drives by team and quarter for a specific game
    List<GameDrives> findByGameIdAndTeamIdAndQuarter(String gameId, String teamId, String quarter);
    
    // Custom query to find drives with specific end events
    @Query("SELECT gd FROM GameDrives gd WHERE gd.gameId = :gameId AND gd.endEvent = :endEvent")
    List<GameDrives> findByGameIdAndEndEvent(@Param("gameId") String gameId, @Param("endEvent") String endEvent);
}
