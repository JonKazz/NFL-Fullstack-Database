package com.nfldb.game_player_stats;

import org.springframework.stereotype.Service;
import java.util.List;
import com.nfldb.dto.PlayerGameStatsDTO;
import com.nfldb.dto.PlayerSeasonSummaryDTO;
import com.nfldb.gameinfo.GameInfo;
import com.nfldb.gameinfo.GameInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class GamePlayerStatsService {
    private final GamePlayerStatsRepository repository;
    private final GameInfoRepository gameInfoRepository;

    public GamePlayerStatsService(GamePlayerStatsRepository repository, GameInfoRepository gameInfoRepository) {
        this.repository = repository;
        this.gameInfoRepository = gameInfoRepository;
    }

    public GamePlayerStats getPlayer(String gameId, String playerId) {
        return repository.findByIdGameIdAndIdPlayerId(gameId, playerId);
    } 

    public List<GamePlayerStats> getPlayers(String gameId) {
        return repository.findByIdGameId(gameId);
    }
    
    public List<PlayerGameStatsDTO> getPlayerGameStats(String playerId, Integer seasonYear) {
        List<GamePlayerStats> playerStats = repository.findByIdPlayerId(playerId);
        List<PlayerGameStatsDTO> result = new java.util.ArrayList<>();
        
        for (GamePlayerStats stats : playerStats) {
            GameInfo gameInfo = gameInfoRepository.findById(stats.getId().getGameId()).orElse(null);
            if (gameInfo != null && (seasonYear == null || gameInfo.getSeasonYear().equals(seasonYear))) {
                result.add(convertToDTO(stats, gameInfo));
            }
        }
        
        return result;
    }
    
    public PlayerSeasonSummaryDTO getPlayerSeasonSummary(String playerId, Integer seasonYear) {
        List<PlayerGameStatsDTO> gameStats = getPlayerGameStats(playerId, seasonYear);
        return calculateSeasonSummary(playerId, seasonYear, gameStats);
    }
    
    private PlayerGameStatsDTO convertToDTO(GamePlayerStats stats, GameInfo gameInfo) {
        PlayerGameStatsDTO dto = new PlayerGameStatsDTO();
        
        // Set game info
        dto.setGameId(stats.getId().getGameId());
        dto.setDate(gameInfo.getDate());
        dto.setSeasonYear(gameInfo.getSeasonYear());
        dto.setSeasonWeek(gameInfo.getSeasonWeek());
        
        // Determine opponent
        String playerTeamId = stats.getTeamId();
        if (playerTeamId.equals(gameInfo.getHomeTeamId())) {
            dto.setOpponent(gameInfo.getAwayTeamId());
            dto.setHomeScore(gameInfo.getHomePoints());
            dto.setAwayScore(gameInfo.getAwayPoints());
        } else {
            dto.setOpponent(gameInfo.getHomeTeamId());
            dto.setHomeScore(gameInfo.getHomePoints());
            dto.setAwayScore(gameInfo.getAwayPoints());
        }
        
        // Set player info
        dto.setTeamId(stats.getTeamId());
        dto.setPosition(stats.getPosition());
        
        // Set stats (only non-null values)
        if (stats.getPassCompletions() != null) dto.setPassCompletions(stats.getPassCompletions());
        if (stats.getPassAttempts() != null) dto.setPassAttempts(stats.getPassAttempts());
        if (stats.getPassYards() != null) dto.setPassYards(stats.getPassYards());
        if (stats.getPassTouchdowns() != null) dto.setPassTouchdowns(stats.getPassTouchdowns());
        if (stats.getPassInterceptions() != null) dto.setPassInterceptions(stats.getPassInterceptions());
        if (stats.getPassRating() != null) dto.setPassRating(stats.getPassRating());
        
        if (stats.getRushAttempts() != null) dto.setRushAttempts(stats.getRushAttempts());
        if (stats.getRushYards() != null) dto.setRushYards(stats.getRushYards());
        if (stats.getRushTouchdowns() != null) dto.setRushTouchdowns(stats.getRushTouchdowns());
        
        if (stats.getReceivingTargets() != null) dto.setReceivingTargets(stats.getReceivingTargets());
        if (stats.getReceivingReceptions() != null) dto.setReceivingReceptions(stats.getReceivingReceptions());
        if (stats.getReceivingYards() != null) dto.setReceivingYards(stats.getReceivingYards());
        if (stats.getReceivingTouchdowns() != null) dto.setReceivingTouchdowns(stats.getReceivingTouchdowns());
        
        if (stats.getDefensiveInterceptions() != null) dto.setDefensiveInterceptions(stats.getDefensiveInterceptions());
        if (stats.getDefensivePassesDefended() != null) dto.setDefensivePassesDefended(stats.getDefensivePassesDefended());
        if (stats.getDefensiveSacks() != null) dto.setDefensiveSacks(stats.getDefensiveSacks());
        if (stats.getDefensiveTacklesCombined() != null) dto.setDefensiveTacklesCombined(stats.getDefensiveTacklesCombined());
        if (stats.getDefensiveTacklesSolo() != null) dto.setDefensiveTacklesSolo(stats.getDefensiveTacklesSolo());
        if (stats.getDefensiveTacklesAssists() != null) dto.setDefensiveTacklesAssists(stats.getDefensiveTacklesAssists());
        
        if (stats.getExtraPointsMade() != null) dto.setExtraPointsMade(stats.getExtraPointsMade());
        if (stats.getExtraPointsAttempted() != null) dto.setExtraPointsAttempted(stats.getExtraPointsAttempted());
        if (stats.getFieldGoalsMade() != null) dto.setFieldGoalsMade(stats.getFieldGoalsMade());
        if (stats.getFieldGoalsAttempted() != null) dto.setFieldGoalsAttempted(stats.getFieldGoalsAttempted());
        
        if (stats.getPunts() != null) dto.setPunts(stats.getPunts());
        if (stats.getPuntYards() != null) dto.setPuntYards(stats.getPuntYards());
        
        if (stats.getKickReturns() != null) dto.setKickReturns(stats.getKickReturns());
        if (stats.getKickReturnYards() != null) dto.setKickReturnYards(stats.getKickReturnYards());
        if (stats.getKickReturnTouchdowns() != null) dto.setKickReturnTouchdowns(stats.getKickReturnTouchdowns());
        if (stats.getPuntReturns() != null) dto.setPuntReturns(stats.getPuntReturns());
        if (stats.getPuntReturnYards() != null) dto.setPuntReturnYards(stats.getPuntReturnYards());
        if (stats.getPuntReturnTouchdowns() != null) dto.setPuntReturnTouchdowns(stats.getPuntReturnTouchdowns());
        
        if (stats.getFumblesTotal() != null) dto.setFumblesTotal(stats.getFumblesTotal());
        if (stats.getFumblesLost() != null) dto.setFumblesLost(stats.getFumblesLost());
        
        return dto;
    }
    
    private PlayerSeasonSummaryDTO calculateSeasonSummary(String playerId, Integer seasonYear, List<PlayerGameStatsDTO> gameStats) {
        PlayerSeasonSummaryDTO summary = new PlayerSeasonSummaryDTO();
        summary.setPlayerId(playerId);
        summary.setSeasonYear(seasonYear);
        summary.setGamesPlayed(gameStats.size());
        
        // Initialize totals
        summary.setTotalPassCompletions(0.0);
        summary.setTotalPassAttempts(0.0);
        summary.setTotalPassYards(0.0);
        summary.setTotalPassTouchdowns(0.0);
        summary.setTotalPassInterceptions(0.0);
        
        summary.setTotalRushAttempts(0.0);
        summary.setTotalRushYards(0.0);
        summary.setTotalRushTouchdowns(0.0);
        
        summary.setTotalReceivingTargets(0.0);
        summary.setTotalReceivingReceptions(0.0);
        summary.setTotalReceivingYards(0.0);
        summary.setTotalReceivingTouchdowns(0.0);
        
        summary.setTotalDefensiveInterceptions(0.0);
        summary.setTotalDefensivePassesDefended(0.0);
        summary.setTotalDefensiveSacks(0.0);
        summary.setTotalDefensiveTacklesCombined(0.0);
        summary.setTotalDefensiveTacklesSolo(0.0);
        summary.setTotalDefensiveTacklesAssists(0.0);
        
        summary.setTotalExtraPointsMade(0.0);
        summary.setTotalExtraPointsAttempted(0.0);
        summary.setTotalFieldGoalsMade(0.0);
        summary.setTotalFieldGoalsAttempted(0.0);
        
        summary.setTotalPunts(0.0);
        summary.setTotalPuntYards(0.0);
        
        summary.setTotalKickReturns(0.0);
        summary.setTotalKickReturnYards(0.0);
        summary.setTotalKickReturnTouchdowns(0.0);
        summary.setTotalPuntReturns(0.0);
        summary.setTotalPuntReturnYards(0.0);
        summary.setTotalPuntReturnTouchdowns(0.0);
        
        summary.setTotalFumblesTotal(0.0);
        summary.setTotalFumblesLost(0.0);
        
        // Sum up all stats
        for (PlayerGameStatsDTO game : gameStats) {
            if (game.getPassCompletions() != null) summary.setTotalPassCompletions(summary.getTotalPassCompletions() + game.getPassCompletions());
            if (game.getPassAttempts() != null) summary.setTotalPassAttempts(summary.getTotalPassAttempts() + game.getPassAttempts());
            if (game.getPassYards() != null) summary.setTotalPassYards(summary.getTotalPassYards() + game.getPassYards());
            if (game.getPassTouchdowns() != null) summary.setTotalPassTouchdowns(summary.getTotalPassTouchdowns() + game.getPassTouchdowns());
            if (game.getPassInterceptions() != null) summary.setTotalPassInterceptions(summary.getTotalPassInterceptions() + game.getPassInterceptions());
            
            if (game.getRushAttempts() != null) summary.setTotalRushAttempts(summary.getTotalRushAttempts() + game.getRushAttempts());
            if (game.getRushYards() != null) summary.setTotalRushYards(summary.getTotalRushYards() + game.getRushYards());
            if (game.getRushTouchdowns() != null) summary.setTotalRushTouchdowns(summary.getTotalRushTouchdowns() + game.getRushTouchdowns());
            
            if (game.getReceivingTargets() != null) summary.setTotalReceivingTargets(summary.getTotalReceivingTargets() + game.getReceivingTargets());
            if (game.getReceivingReceptions() != null) summary.setTotalReceivingReceptions(summary.getTotalReceivingReceptions() + game.getReceivingReceptions());
            if (game.getReceivingYards() != null) summary.setTotalReceivingYards(summary.getTotalReceivingYards() + game.getReceivingYards());
            if (game.getReceivingTouchdowns() != null) summary.setTotalReceivingTouchdowns(summary.getTotalReceivingTouchdowns() + game.getReceivingTouchdowns());
            
            if (game.getDefensiveInterceptions() != null) summary.setTotalDefensiveInterceptions(summary.getTotalDefensiveInterceptions() + game.getDefensiveInterceptions());
            if (game.getDefensivePassesDefended() != null) summary.setTotalDefensivePassesDefended(summary.getTotalDefensivePassesDefended() + game.getDefensivePassesDefended());
            if (game.getDefensiveSacks() != null) summary.setTotalDefensiveSacks(summary.getTotalDefensiveSacks() + game.getDefensiveSacks());
            if (game.getDefensiveTacklesCombined() != null) summary.setTotalDefensiveTacklesCombined(summary.getTotalDefensiveTacklesCombined() + game.getDefensiveTacklesCombined());
            if (game.getDefensiveTacklesSolo() != null) summary.setTotalDefensiveTacklesSolo(summary.getTotalDefensiveTacklesSolo() + game.getDefensiveTacklesSolo());
            if (game.getDefensiveTacklesAssists() != null) summary.setTotalDefensiveTacklesAssists(summary.getTotalDefensiveTacklesAssists() + game.getDefensiveTacklesAssists());
            
            if (game.getExtraPointsMade() != null) summary.setTotalExtraPointsMade(summary.getTotalExtraPointsMade() + game.getExtraPointsMade());
            if (game.getExtraPointsAttempted() != null) summary.setTotalExtraPointsAttempted(summary.getTotalExtraPointsAttempted() + game.getExtraPointsAttempted());
            if (game.getFieldGoalsMade() != null) summary.setTotalFieldGoalsMade(summary.getTotalFieldGoalsMade() + game.getFieldGoalsMade());
            if (game.getFieldGoalsAttempted() != null) summary.setTotalFieldGoalsAttempted(summary.getTotalFieldGoalsAttempted() + game.getFieldGoalsAttempted());
            
            if (game.getPunts() != null) summary.setTotalPunts(summary.getTotalPunts() + game.getPunts());
            if (game.getPuntYards() != null) summary.setTotalPuntYards(summary.getTotalPuntYards() + game.getPuntYards());
            
            if (game.getKickReturns() != null) summary.setTotalKickReturns(summary.getTotalKickReturns() + game.getKickReturns());
            if (game.getKickReturnYards() != null) summary.setTotalKickReturnYards(summary.getTotalKickReturnYards() + game.getKickReturnYards());
            if (game.getKickReturnTouchdowns() != null) summary.setTotalKickReturnTouchdowns(summary.getTotalKickReturnTouchdowns() + game.getKickReturnTouchdowns());
            if (game.getPuntReturns() != null) summary.setTotalPuntReturns(summary.getTotalPuntReturns() + game.getPuntReturns());
            if (game.getPuntReturnYards() != null) summary.setTotalPuntReturnYards(summary.getTotalPuntReturnYards() + game.getPuntReturnYards());
            if (game.getPuntReturnTouchdowns() != null) summary.setTotalPuntReturnTouchdowns(summary.getTotalPuntReturnTouchdowns() + game.getPuntReturnTouchdowns());
            
            if (game.getFumblesTotal() != null) summary.setTotalFumblesTotal(summary.getTotalFumblesTotal() + game.getFumblesTotal());
            if (game.getFumblesLost() != null) summary.setTotalFumblesLost(summary.getTotalFumblesLost() + game.getFumblesLost());
        }
        
        // Calculate averages
        if (summary.getTotalRushAttempts() > 0) {
            summary.setAvgRushYardsPerAttempt(summary.getTotalRushYards() / summary.getTotalRushAttempts());
        }
        if (summary.getTotalReceivingReceptions() > 0) {
            summary.setAvgReceivingYardsPerReception(summary.getTotalReceivingYards() / summary.getTotalReceivingReceptions());
        }
        if (summary.getTotalPunts() > 0) {
            summary.setAvgPuntYardsPerPunt(summary.getTotalPuntYards() / summary.getTotalPunts());
        }
        
        return summary;
    }
}
