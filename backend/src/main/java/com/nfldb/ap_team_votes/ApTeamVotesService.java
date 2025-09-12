package com.nfldb.ap_team_votes;

import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ApTeamVotesService {
    private final ApTeamVotesRepository repository;

    public ApTeamVotesService(ApTeamVotesRepository repository) {
        this.repository = repository;
    }

    /**
     * Get all AP team votes for a specific season and team
     * @param seasonYear the season year
     * @param teamId the team ID
     * @return list of AP team votes for the specified season and team
     */
    public List<ApTeamVotes> getApTeamVotesBySeasonAndTeam(Integer seasonYear, String teamId) {
        return repository.findBySeasonYearAndTeamId(seasonYear, teamId);
    }
}
