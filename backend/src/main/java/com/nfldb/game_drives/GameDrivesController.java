package com.nfldb.game_drives;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/game-drives")
@CrossOrigin(origins = "*")
public class GameDrivesController {

    private final GameDrivesService gameDrivesService;

    public GameDrivesController(GameDrivesService gameDrivesService) {
        this.gameDrivesService = gameDrivesService;
    }

    // Get all drives for a specific game
    @GetMapping("/game")
    public ResponseEntity<List<GameDrives>> getDrivesByGame(@RequestParam String gameId) {
        List<GameDrives> drives = gameDrivesService.getDrivesByGame(gameId);
        return ResponseEntity.ok(drives);
    }
}
