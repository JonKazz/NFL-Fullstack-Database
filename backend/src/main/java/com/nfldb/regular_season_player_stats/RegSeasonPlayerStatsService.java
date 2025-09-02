package com.nfldb.regular_season_player_stats;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class RegSeasonPlayerStatsService {
    private final RegSeasonPlayerStatsRepository repository;

    public RegSeasonPlayerStatsService(RegSeasonPlayerStatsRepository repository) {
        this.repository = repository;
    }

    public RegSeasonPlayerStats getPlayerSeason(String playerId, Integer seasonYear) {
        return repository.findByPlayerIdAndSeasonYear(playerId, seasonYear);
    } 

    public List<RegSeasonPlayerStats> getTeamBySeason(Integer seasonYear, String teamId) {
        return repository.findByTeamIdAndSeasonYear(teamId, seasonYear);
    }
    
    public List<Integer> getPlayerSeasons(String playerId) {
        List<RegSeasonPlayerStats> playerSeasons = repository.findByPlayerId(playerId);
        
        return playerSeasons.stream()
            .map(RegSeasonPlayerStats::getSeasonYear)
            .distinct()
            .sorted(Comparator.reverseOrder()) // Most recent first
            .collect(Collectors.toList());
    }
    
    public List<RegSeasonPlayerStats> getAllPlayersBySeason(Integer seasonYear) {
        return repository.findBySeasonYear(seasonYear);
    }
}
