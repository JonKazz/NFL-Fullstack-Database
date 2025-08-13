package com.nfldb.gamestats;

import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    @GetMapping("/game-all")
    public List<GameStats> getAllGameStats(@RequestParam String gameId) {
        return gameStatsService.getAllGameStats(gameId);
    }
}
