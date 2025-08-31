package com.nfldb.season_team_info;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeasonTeamInfoRepository extends JpaRepository<SeasonTeamInfo, String> {
    java.util.Optional<SeasonTeamInfo> findFirstByTeamIdAndSeasonYear(String teamId, Integer seasonYear);
    List<SeasonTeamInfo> findBySeasonYear(Integer seasonYear);
}
