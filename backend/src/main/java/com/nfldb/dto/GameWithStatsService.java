package com.nfldb.dto;

import com.nfldb.game.Game;
import com.nfldb.game.GameRepository;
import com.nfldb.gamestats.GameStats;
import com.nfldb.gamestats.GameStatsRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class GameWithStatsService {
    private final GameRepository gameRepository;
    private final GameStatsRepository gameStatsRepository;

    public GameWithStatsService(GameRepository gameRepository, GameStatsRepository gameStatsRepository) {
        this.gameRepository = gameRepository;
        this.gameStatsRepository = gameStatsRepository;
    }


    public GameWithStatsDTO getGameWithStats(String gameId) {
        Game game = gameRepository.findByGameId(gameId);
        List<GameStats> stats = gameStatsRepository.findByIdGameId(gameId);
        return new GameWithStatsDTO(game, stats);
    }

    public List<GameWithStatsDTO> getGamesWithStatsForTeamAndSeason(String teamId, int seasonYear) {
        List<Game> games = gameRepository.findByTeamAndSeasonYear(teamId, seasonYear);
        List<GameWithStatsDTO> result = new ArrayList<>();

        for (Game game : games) {
            List<GameStats> stats = gameStatsRepository.findByIdGameId(game.getGameId());
            GameWithStatsDTO dto = new GameWithStatsDTO(game, stats);
            result.add(dto);
        }
        return result;
    }
} 