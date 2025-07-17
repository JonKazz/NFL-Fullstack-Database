package com.nfldb.game;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/game")
    public Game getGame(@RequestParam String gameId, @RequestParam String teamId) {
        return gameService.getGame(gameId, teamId);
    }

    @GetMapping("/fullseason")
    public List<Game> getFullYearGames(@RequestParam String team, @RequestParam Integer year) {
        return gameService.getGamesByYear(team, year);
    }
}
