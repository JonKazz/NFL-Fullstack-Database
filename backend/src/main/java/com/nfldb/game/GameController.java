package com.nfldb.game;

import com.nfldb.game.Game;
import com.nfldb.game.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/search")
    public List<Game> getByTeamAndYear(@RequestParam String team, @RequestParam Integer year) {
        return gameService.getGamesByTeamAndYear(team, year);
    }
}
