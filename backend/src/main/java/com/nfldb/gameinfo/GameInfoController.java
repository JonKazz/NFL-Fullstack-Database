package com.nfldb.gameinfo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/game-info")
public class GameInfoController {

    private final GameInfoService gameInfoService;

    public GameInfoController(GameInfoService gameInfoService) {
        this.gameInfoService = gameInfoService;
    }

    @GetMapping("/game")
    public GameInfo getGame(@RequestParam String gameId) {
        return gameInfoService.getGame(gameId);
    }

    @GetMapping("/fullseason")
    public List<GameInfo> getFullYearGames(@RequestParam String teamId, @RequestParam Integer seasonYear) {
        return gameInfoService.getGamesByYear(teamId, seasonYear);
    }

    @GetMapping("/playoffs")
    public List<GameInfo> getPlayoffGames(@RequestParam Integer seasonYear) {
        return gameInfoService.getPlayoffGamesBySeason(seasonYear);
    }
    
    @GetMapping("/count")
    public Long getTotalGameInfoCount() {
        return gameInfoService.getTotalGameInfoCount();
    }

    /**
     * Check if a game exists in the database
     * @param gameId The ID of the game to check
     * @return true if game exists, false otherwise
     */
    @GetMapping("/exists/{gameId}")
    public boolean checkGameExists(@PathVariable String gameId) {
        return gameInfoService.checkGameExists(gameId);
    }
}
