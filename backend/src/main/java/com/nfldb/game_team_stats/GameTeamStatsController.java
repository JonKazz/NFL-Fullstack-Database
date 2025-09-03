package com.nfldb.game_team_stats;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/game-team-stats")
public class GameTeamStatsController {
    private final GameTeamStatsService gameTeamStatsService;

    public GameTeamStatsController(GameTeamStatsService gameTeamStatsService) {
        this.gameTeamStatsService = gameTeamStatsService;
    }

    @GetMapping("/game")
    public List<GameTeamStats> getGameTeamStats(@RequestParam String gameId) {
        return gameTeamStatsService.getGameTeamStats(gameId);
    }
}
