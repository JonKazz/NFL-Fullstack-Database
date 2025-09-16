package com.nfldb.season_team_info;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SeasonTeamInfoService {
    private final SeasonTeamInfoRepository repository;

    public SeasonTeamInfoService(SeasonTeamInfoRepository repository) {
        this.repository = repository;
    }

    /**
     * Retrieve team information for a specific team and season
     * @param teamId The team identifier (e.g., "ne", "kc", "gb")
     * @param year The season year
     * @return Optional containing SeasonTeamInfo or empty if not found
     */
    public Optional<SeasonTeamInfo> getTeam(String teamId, Integer year) {
        return Optional.ofNullable(repository.findFirstByTeamIdAndSeasonYear(teamId, year));
    }

    /**
     * Retrieve all teams for a specific season
     * @param year The season year
     * @return List of SeasonTeamInfo objects for the specified year
     */
    public List<SeasonTeamInfo> getTeamsBySeason(Integer year) {
        return repository.findBySeasonYear(year);
    }
}