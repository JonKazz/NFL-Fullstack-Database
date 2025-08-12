package com.nfldb.gameinfo;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GameInfoService {
    private final GameInfoRepository repository;

    public GameInfoService(GameInfoRepository repository) {
        this.repository = repository;
    }

    public GameInfo getGame(String gameId) {
        return repository.findByGameId(gameId);
    }

    public List<GameInfo> getGamesByYear(String teamId, Integer seasonYear) {
        return repository.findByTeamAndSeasonYear(teamId, seasonYear);
    }

    public List<GameInfo> getPlayoffGamesBySeason(Integer seasonYear) {
        return repository.findPlayoffGamesBySeason(seasonYear);
    }
}