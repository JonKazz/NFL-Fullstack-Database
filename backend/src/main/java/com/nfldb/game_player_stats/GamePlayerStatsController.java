package com.nfldb.game_player_stats;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.nfldb.dto.PlayerGameStatsDTO;
import com.nfldb.dto.PlayerSeasonSummaryDTO;

@RestController
@RequestMapping("/api/game-player-stats")
public class GamePlayerStatsController {
    private final GamePlayerStatsService gamePlayerStatsService;

    public GamePlayerStatsController(GamePlayerStatsService gamePlayerStatsService) {
        this.gamePlayerStatsService = gamePlayerStatsService;
    }

    @GetMapping("/player")
    public GamePlayerStats getPlayer(@RequestParam String gameId, @RequestParam String playerId) {
        return gamePlayerStatsService.getPlayer(gameId, playerId);
    }

    @GetMapping("/players")
    public List<GamePlayerStats> getPlayers(@RequestParam String gameId) {
        return gamePlayerStatsService.getPlayers(gameId);
    }
    
    @GetMapping("/player/{playerId}")
    public List<PlayerGameStatsDTO> getPlayerGameStats(@PathVariable String playerId, @RequestParam(required = false) Integer seasonYear) {
        return gamePlayerStatsService.getPlayerGameStats(playerId, seasonYear);
    }
    
    @GetMapping("/player/{playerId}/season/{seasonYear}/summary")
    public PlayerSeasonSummaryDTO getPlayerSeasonSummary(@PathVariable String playerId, @PathVariable Integer seasonYear) {
        return gamePlayerStatsService.getPlayerSeasonSummary(playerId, seasonYear);
    }
}
