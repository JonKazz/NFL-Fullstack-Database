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
}
