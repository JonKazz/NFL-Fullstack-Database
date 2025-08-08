package com.nfldb.game_player_stats;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GamePlayerStatsService {
    private final GamePlayerStatsRepository repository;

    public GamePlayerStatsService(GamePlayerStatsRepository repository) {
        this.repository = repository;
    }

    public GamePlayerStats getPlayer(String gameId, String playerId) {
        return repository.findByIdGameIdAndIdPlayerId(gameId, playerId);
    } 

    public List<GamePlayerStats> getPlayers(String gameId) {
        return repository.findByIdGameId(gameId);
    }
}
