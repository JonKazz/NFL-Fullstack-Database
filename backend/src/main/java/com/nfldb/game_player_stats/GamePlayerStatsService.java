package com.nfldb.game_player_stats;

import com.nfldb.dto.PlayerStatsWithGameInfoDTO;
import com.nfldb.gameinfo.GameInfo;
import com.nfldb.gameinfo.GameInfoService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
public class GamePlayerStatsService {
    private final GamePlayerStatsRepository repository;
    private final GameInfoService gameInfoService;

    public GamePlayerStatsService(GamePlayerStatsRepository repository, GameInfoService gameInfoService) {
        this.repository = repository;
        this.gameInfoService = gameInfoService;
    }

    public List<GamePlayerStats> getGame(String gameId) {
        return repository.findByGameId(gameId);
    }

    public GamePlayerStats getPlayer(String gameId, String playerId) {
        return repository.findByGameIdAndPlayerId(gameId, playerId);
    } 

    public List<PlayerStatsWithGameInfoDTO> getGamesByPlayerSeason(String playerId, String seasonYear) {
        List<GamePlayerStats> playerStats = repository.findByPlayerIdAndSeasonYear(playerId, seasonYear);
        List<PlayerStatsWithGameInfoDTO> result = new ArrayList<>();
        
        for (GamePlayerStats stats : playerStats) {
            GameInfo gameInfo = gameInfoService.getGame(stats.getGameId());
            if (gameInfo != null) {
                result.add(new PlayerStatsWithGameInfoDTO(gameInfo, stats));
            }
        }
        
        return result;
    }

    public String getPlayerTeamBySeason(String playerId, Integer seasonYear) {
        List<GamePlayerStats> playerStats = repository.findByPlayerIdAndSeasonYearOrderByLastGame(playerId, seasonYear);
        
        if (playerStats.isEmpty()) {
            return null; // Player not found in that season
        }
        
        // Return the team from the first (most recent) game
        return playerStats.get(0).getTeamId();
    }
}
