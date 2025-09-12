package com.nfldb.ap_team_votes;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApTeamVotesRepository extends JpaRepository<ApTeamVotes, String> {
    /**
     * Find all AP team votes for a specific season and team
     * @param seasonYear the season year
     * @param teamId the team ID
     * @return list of AP team votes for the specified season and team
     */
    List<ApTeamVotes> findBySeasonYearAndTeamId(Integer seasonYear, String teamId);
}
