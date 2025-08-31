package com.nfldb.regular_season_player_stats;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/season-stats")
public class RegSeasonPlayerStatsController {
    private final RegSeasonPlayerStatsService gamePlayerStatsService;

    public RegSeasonPlayerStatsController(RegSeasonPlayerStatsService gamePlayerStatsService) {
        this.gamePlayerStatsService = gamePlayerStatsService;
    }

    @GetMapping("/player")
    public RegSeasonPlayerStats getPlayerSeason(@RequestParam String playerId, @RequestParam Integer seasonYear) {
        return gamePlayerStatsService.getPlayerSeason(playerId, seasonYear);
    }

    @GetMapping("/team")
    public List<RegSeasonPlayerStats> getTeamBySeason(@RequestParam Integer seasonYear, @RequestParam String teamId) {
        return gamePlayerStatsService.getTeamBySeason(seasonYear, teamId);
    }
    
    @GetMapping("/player/{playerId}/seasons")
    public List<Integer> getPlayerSeasons(@PathVariable String playerId) {
        return gamePlayerStatsService.getPlayerSeasons(playerId);
    }
    
    @GetMapping("/season")
    public List<RegSeasonPlayerStats> getAllPlayersBySeason(@RequestParam Integer seasonYear) {
        return gamePlayerStatsService.getAllPlayersBySeason(seasonYear);
    }
}
