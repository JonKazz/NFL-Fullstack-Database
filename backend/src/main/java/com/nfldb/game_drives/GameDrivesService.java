package com.nfldb.game_drives;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameDrivesService {
    
    private final GameDrivesRepository repository;

    public GameDrivesService(GameDrivesRepository repository) {
        this.repository = repository;
    }

    // Get all drives for a specific game
    public List<GameDrives> getDrivesByGame(String gameId) {
        return repository.findByGameId(gameId);
    }

    // Get all drives for a specific team in a specific game
    public List<GameDrives> getDrivesByGameAndTeam(String gameId, String teamId) {
        return repository.findByGameIdAndTeamId(gameId, teamId);
    }

    // Get drives by quarter for a specific game
    public List<GameDrives> getDrivesByGameAndQuarter(String gameId, String quarter) {
        return repository.findByGameIdAndQuarter(gameId, quarter);
    }

    // Get drives by team and quarter for a specific game
    public List<GameDrives> getDrivesByGameTeamAndQuarter(String gameId, String teamId, String quarter) {
        return repository.findByGameIdAndTeamIdAndQuarter(gameId, teamId, quarter);
    }

    // Get drives with specific end events for a game
    public List<GameDrives> getDrivesByGameAndEndEvent(String gameId, String endEvent) {
        return repository.findByGameIdAndEndEvent(gameId, endEvent);
    }

    // Get a specific drive by ID
    public GameDrives getDriveById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Save a new drive
    public GameDrives saveDrive(GameDrives drive) {
        return repository.save(drive);
    }

    // Update an existing drive
    public GameDrives updateDrive(Long id, GameDrives driveDetails) {
        GameDrives drive = repository.findById(id).orElse(null);
        if (drive != null) {
            drive.setGameId(driveDetails.getGameId());
            drive.setTeamId(driveDetails.getTeamId());
            drive.setDriveNum(driveDetails.getDriveNum());
            drive.setQuarter(driveDetails.getQuarter());
            drive.setTimeStart(driveDetails.getTimeStart());
            drive.setStartAt(driveDetails.getStartAt());
            drive.setPlays(driveDetails.getPlays());
            drive.setTimeTotal(driveDetails.getTimeTotal());
            drive.setNetYds(driveDetails.getNetYds());
            drive.setEndEvent(driveDetails.getEndEvent());
            return repository.save(drive);
        }
        return null;
    }

    // Delete a drive
    public boolean deleteDrive(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
