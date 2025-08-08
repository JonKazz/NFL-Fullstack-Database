package com.nfldb.game_player_stats;

import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}
