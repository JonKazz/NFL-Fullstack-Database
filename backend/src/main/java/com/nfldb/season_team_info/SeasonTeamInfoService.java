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

    public Optional<SeasonTeamInfo> getTeamInfo(String teamId, Integer year) {
        return repository.findFirstByTeamIdAndSeasonYear(teamId, year);
    }

    public List<SeasonTeamInfo> getTeamsBySeason(Integer year) {
        return repository.findBySeasonYear(year);
    }

    public List<SeasonTeamInfo> getTeamsStatsBySeason(Integer year) {
        return repository.findBySeasonYear(year);
    }
}