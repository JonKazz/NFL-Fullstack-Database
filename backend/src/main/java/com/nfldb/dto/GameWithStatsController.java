package com.nfldb.dto;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameWithStatsController {
    private final GameWithStatsService gameWithStatsService;

    public GameWithStatsController(GameWithStatsService gameWithStatsService) {
        this.gameWithStatsService = gameWithStatsService;
    }

    @GetMapping("/game")
    public GameWithStatsDTO getGameWithStats(@RequestParam String gameId) {
        return gameWithStatsService.getGameWithStats(gameId);
    }

    @GetMapping("/fullseason")
    public List<GameWithStatsDTO> getFullSeason(@RequestParam String teamId, @RequestParam int seasonYear) {
        return gameWithStatsService.getGamesWithStatsForTeamAndSeason(teamId, seasonYear);
    }
} 