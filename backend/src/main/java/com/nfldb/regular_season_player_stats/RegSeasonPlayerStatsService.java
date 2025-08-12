package com.nfldb.regular_season_player_stats;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegSeasonPlayerStatsService {
    private final RegSeasonPlayerStatsRepository repository;

    public RegSeasonPlayerStatsService(RegSeasonPlayerStatsRepository repository) {
        this.repository = repository;
    }

    public RegSeasonPlayerStats getPlayerSeason(String playerId, Integer seasonYear) {
        return repository.findByIdPlayerIdAndIdSeasonYear(playerId, seasonYear);
    } 

    public List<RegSeasonPlayerStats> getTeamBySeason(Integer seasonYear, String teamId) {
        return repository.findByIdTeamIdAndIdSeasonYear(teamId, seasonYear);
    }
}
