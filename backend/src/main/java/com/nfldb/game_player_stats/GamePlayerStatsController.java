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

    @GetMapping("/team-season")
    public List<GamePlayerStats> getTeamSeasonStats(@RequestParam String teamId, @RequestParam String year) {
        return gamePlayerStatsService.getTeamSeasonStats(teamId, year);
    }

    @GetMapping("/team-season-aggregated")
    public List<Object> getTeamSeasonAggregatedStats(@RequestParam String teamId, @RequestParam String year) {
        return gamePlayerStatsService.getTeamSeasonAggregatedStats(teamId, year);
    }
}
