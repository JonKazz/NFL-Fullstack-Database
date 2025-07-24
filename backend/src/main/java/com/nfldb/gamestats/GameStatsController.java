package com.nfldb.gamestats;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gamestats")
public class GameStatsController {
    private final GameStatsService gameStatsService;

    public GameStatsController(GameStatsService gameStatsService) {
        this.gameStatsService = gameStatsService;
    }

    @GetMapping("/game")
    public GameStats getGameStats(@RequestParam String gameId, @RequestParam String teamId) {
        return gameStatsService.getGameStats(gameId, teamId);
    }
}
