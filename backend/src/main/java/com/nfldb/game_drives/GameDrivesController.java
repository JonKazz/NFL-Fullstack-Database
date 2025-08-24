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

    // Get drives for a specific team in a specific game
    @GetMapping("/game/team")
    public ResponseEntity<List<GameDrives>> getDrivesByGameAndTeam(
            @RequestParam String gameId, 
            @RequestParam String teamId) {
        List<GameDrives> drives = gameDrivesService.getDrivesByGameAndTeam(gameId, teamId);
        return ResponseEntity.ok(drives);
    }

    // Get drives by quarter for a specific game
    @GetMapping("/game/quarter")
    public ResponseEntity<List<GameDrives>> getDrivesByGameAndQuarter(
            @RequestParam String gameId, 
            @RequestParam String quarter) {
        List<GameDrives> drives = gameDrivesService.getDrivesByGameAndQuarter(gameId, quarter);
        return ResponseEntity.ok(drives);
    }

    // Get drives by team and quarter for a specific game
    @GetMapping("/game/team/quarter")
    public ResponseEntity<List<GameDrives>> getDrivesByGameTeamAndQuarter(
            @RequestParam String gameId, 
            @RequestParam String teamId, 
            @RequestParam String quarter) {
        List<GameDrives> drives = gameDrivesService.getDrivesByGameTeamAndQuarter(gameId, teamId, quarter);
        return ResponseEntity.ok(drives);
    }

    // Get drives with specific end events for a game
    @GetMapping("/game/end-event")
    public ResponseEntity<List<GameDrives>> getDrivesByGameAndEndEvent(
            @RequestParam String gameId, 
            @RequestParam String endEvent) {
        List<GameDrives> drives = gameDrivesService.getDrivesByGameAndEndEvent(gameId, endEvent);
        return ResponseEntity.ok(drives);
    }

    // Get a specific drive by ID
    @GetMapping("/{id}")
    public ResponseEntity<GameDrives> getDriveById(@PathVariable Long id) {
        GameDrives drive = gameDrivesService.getDriveById(id);
        if (drive != null) {
            return ResponseEntity.ok(drive);
        }
        return ResponseEntity.notFound().build();
    }

    // Create a new drive
    @PostMapping
    public ResponseEntity<GameDrives> createDrive(@RequestBody GameDrives drive) {
        GameDrives savedDrive = gameDrivesService.saveDrive(drive);
        return ResponseEntity.ok(savedDrive);
    }

    // Update an existing drive
    @PutMapping("/{id}")
    public ResponseEntity<GameDrives> updateDrive(@PathVariable Long id, @RequestBody GameDrives driveDetails) {
        GameDrives updatedDrive = gameDrivesService.updateDrive(id, driveDetails);
        if (updatedDrive != null) {
            return ResponseEntity.ok(updatedDrive);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete a drive
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDrive(@PathVariable Long id) {
        boolean deleted = gameDrivesService.deleteDrive(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
