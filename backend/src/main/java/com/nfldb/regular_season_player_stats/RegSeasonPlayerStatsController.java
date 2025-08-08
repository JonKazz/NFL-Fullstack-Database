package com.nfldb.regular_season_player_stats;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/game-player-stats")
public class RegSeasonPlayerStatsController {
    private final RegSeasonPlayerStatsService gamePlayerStatsService;

    public RegSeasonPlayerStatsController(RegSeasonPlayerStatsService gamePlayerStatsService) {
        this.gamePlayerStatsService = gamePlayerStatsService;
    }

    @GetMapping("/player")
    public RegSeasonPlayerStats getPlayerSeason(@RequestParam String playerId, @RequestParam Integer seasonYear) {
        return gamePlayerStatsService.getPlayerSeason(playerId, seasonYear);
    }
}
