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

    public Optional<SeasonTeamInfo> getTeam(String teamId, Integer year) {
        return Optional.ofNullable(repository.findFirstByTeamIdAndSeasonYear(teamId, year));
    }

    public List<SeasonTeamInfo> getTeamsBySeason(Integer year) {
        return repository.findBySeasonYear(year);
    }
}