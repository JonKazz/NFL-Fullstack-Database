package com.nfldb.ap_team_votes;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ap-team-votes")
public class ApTeamVotesController {

    private final ApTeamVotesService apTeamVotesService;

    public ApTeamVotesController(ApTeamVotesService apTeamVotesService) {
        this.apTeamVotesService = apTeamVotesService;
    }

    /**
     * Get AP team votes by season and team
     * @param seasonYear the season year
     * @param teamId the team ID
     * @return list of AP team votes for the specified season and team
     */
    @GetMapping("/{seasonYear}/{teamId}")
    public List<ApTeamVotes> getApTeamVotesBySeasonAndTeam(
            @PathVariable Integer seasonYear, 
            @PathVariable String teamId) {
        return apTeamVotesService.getApTeamVotesBySeasonAndTeam(seasonYear, teamId);
    }
}
