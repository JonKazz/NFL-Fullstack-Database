package com.nfldb.game_player_stats;

import com.nfldb.dto.PlayerStatsWithGameInfoDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/game-player-stats")
public class GamePlayerStatsController {
    private final GamePlayerStatsService gamePlayerStatsService;

    public GamePlayerStatsController(GamePlayerStatsService gamePlayerStatsService) {
        this.gamePlayerStatsService = gamePlayerStatsService;
    }

    @GetMapping("/game")
    public List<GamePlayerStats> getGame(@RequestParam String gameId) {
        return gamePlayerStatsService.getGame(gameId);
    }

    @GetMapping("/player")
    public GamePlayerStats getPlayer(@RequestParam String gameId, @RequestParam String playerId) {
        return gamePlayerStatsService.getPlayer(gameId, playerId);
    }

    @GetMapping("/season")
    public List<PlayerStatsWithGameInfoDTO> getGamesByPlayerSeason(@RequestParam String playerId, @RequestParam String seasonYear) {
        return gamePlayerStatsService.getGamesByPlayerSeason(playerId, seasonYear);
    }

    @GetMapping("/player-team")
    public String getPlayerTeamBySeason(@RequestParam String playerId, @RequestParam Integer seasonYear) {
        return gamePlayerStatsService.getPlayerTeamBySeason(playerId, seasonYear);
    }
}
