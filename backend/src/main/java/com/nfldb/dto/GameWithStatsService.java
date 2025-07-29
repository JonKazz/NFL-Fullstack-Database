package com.nfldb.dto;

import com.nfldb.gameinfo.GameInfo;
import com.nfldb.gameinfo.GameInfoRepository;
import com.nfldb.gamestats.GameStats;
import com.nfldb.gamestats.GameStatsRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class GameWithStatsService {
    private final GameInfoRepository gameRepository;
    private final GameStatsRepository gameStatsRepository;

    public GameWithStatsService(GameInfoRepository gameRepository, GameStatsRepository gameStatsRepository) {
        this.gameRepository = gameRepository;
        this.gameStatsRepository = gameStatsRepository;
    }


    public GameWithStatsDTO getGameWithStats(String gameId) {
        GameInfo game = gameRepository.findByGameId(gameId);
        List<GameStats> stats = gameStatsRepository.findByIdGameId(gameId);
        return new GameWithStatsDTO(game, stats);
    }

    public List<GameWithStatsDTO> getGamesWithStatsForTeamAndSeason(String teamId, int seasonYear) {
        List<GameInfo> games = gameRepository.findByTeamAndSeasonYear(teamId, seasonYear);
        List<GameWithStatsDTO> result = new ArrayList<>();

        for (GameInfo game : games) {
            List<GameStats> stats = gameStatsRepository.findByIdGameId(game.getGameId());
            GameWithStatsDTO dto = new GameWithStatsDTO(game, stats);
            result.add(dto);
        }
        return result;
    }
} 